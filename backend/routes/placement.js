const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Application = require('../models/Application');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// @route  GET /api/placement/companies
// @desc   Get all companies
// @access Public
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find().sort({ registrationDeadline: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/placement/companies/:id
// @desc   Get single company by ID
// @access Public
router.get('/companies/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  POST /api/placement/companies/:id/apply
// @desc   Apply to a company
// @access Private (students only)
router.post('/companies/:id/apply', authMiddleware, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (company.status === 'closed') {
      return res.status(400).json({ message: 'Applications are closed for this company' });
    }

    // Check if already applied
    const existing = await Application.findOne({
      student: req.user.id,
      company: req.params.id
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this company' });
    }

    // Create application
    const application = new Application({
      student: req.user.id,
      company: req.params.id
    });
    await application.save();

    // Add student to company's applicants list
    company.applicants.push(req.user.id);
    await company.save();

    res.json({ message: 'Application submitted successfully!', application });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error while applying' });
  }
});

// @route  GET /api/placement/applications
// @desc   Get current student's applications
// @access Private
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('company', 'name industry location package jobProfile status')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/placement/analytics
// @desc   Get placement analytics for logged-in student
// @access Private
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const companies = await Company.find();
    const applications = await Application.find({ student: req.user.id }).populate('company');

    const userCgpa = user.cgpa || 8.0;
    const userBranch = user.department || 'CSE';
    const userBacklogs = user.backlogs || 0;
    const userSkills = (user.skills || []).map(s => s.toLowerCase());

    // Eligibility analysis
    let eligibleCompanies = 0;
    let notEligibleCompanies = 0;
    const byReason = { cgpa: 0, branch: 0, backlogs: 0, year: 0 };

    companies.forEach(c => {
      const cgpaOk = userCgpa >= (c.eligibility?.minCgpa || 0);
      const branchOk = !c.eligibility?.allowedBranches?.length ||
        c.eligibility.allowedBranches.includes(userBranch) ||
        c.eligibility.allowedBranches.includes('ALL');
      const backlogsOk = userBacklogs <= (c.eligibility?.maxBacklogs ?? 99);

      if (cgpaOk && branchOk && backlogsOk) {
        eligibleCompanies++;
      } else {
        notEligibleCompanies++;
        if (!cgpaOk) byReason.cgpa++;
        if (!branchOk) byReason.branch++;
        if (!backlogsOk) byReason.backlogs++;
      }
    });

    // Company stats
    const byIndustry = {};
    const byPackage = { high: 0, medium: 0, low: 0 };
    companies.forEach(c => {
      byIndustry[c.industry] = (byIndustry[c.industry] || 0) + 1;
      const pkg = c.package?.max || 0;
      if (pkg >= 30) byPackage.high++;
      else if (pkg >= 15) byPackage.medium++;
      else byPackage.low++;
    });

    // Skills analysis
    const allRequiredSkillsSet = new Set();
    companies.forEach(c => {
      (c.skillsRequired || []).forEach(s => allRequiredSkillsSet.add(s.skill));
    });
    const allRequiredSkills = [...allRequiredSkillsSet];
    const possessedSkills = allRequiredSkills.filter(s =>
      userSkills.includes(s.toLowerCase())
    );
    const missingSkills = allRequiredSkills.filter(s =>
      !userSkills.includes(s.toLowerCase())
    );

    const softSkillKeywords = ['communication', 'leadership', 'teamwork', 'problem solving'];
    const technicalRequired = allRequiredSkills.filter(s => !softSkillKeywords.includes(s.toLowerCase())).length;
    const technicalPossessed = possessedSkills.filter(s => !softSkillKeywords.includes(s.toLowerCase())).length;
    const softRequired = allRequiredSkills.filter(s => softSkillKeywords.includes(s.toLowerCase())).length;
    const softPossessed = possessedSkills.filter(s => softSkillKeywords.includes(s.toLowerCase())).length;

    // Application stats
    const appStats = {
      applied: applications.length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      waiting: applications.filter(a => a.status === 'applied').length
    };

    // Recommendations — eligible companies with best skill match
    const recommendations = companies
      .filter(c => {
        const cgpaOk = userCgpa >= (c.eligibility?.minCgpa || 0);
        const branchOk = !c.eligibility?.allowedBranches?.length ||
          c.eligibility.allowedBranches.includes(userBranch) ||
          c.eligibility.allowedBranches.includes('ALL');
        return cgpaOk && branchOk && c.status !== 'closed';
      })
      .map(c => {
        const totalSkills = c.skillsRequired?.length || 1;
        const matchedSkills = (c.skillsRequired || []).filter(s =>
          userSkills.includes(s.skill.toLowerCase())
        ).length;
        return {
          id: c._id,
          name: c.name,
          package: c.package?.max || c.package?.min || 0,
          totalSkills,
          possessedSkills: matchedSkills,
          matchPercentage: ((matchedSkills / totalSkills) * 100).toFixed(1),
          deadline: c.registrationDeadline
        };
      })
      .sort((a, b) => parseFloat(b.matchPercentage) - parseFloat(a.matchPercentage))
      .slice(0, 5);

    res.json({
      companyStats: {
        total: companies.length,
        byStatus: {
          open: companies.filter(c => c.status === 'open').length,
          upcoming: companies.filter(c => c.status === 'upcoming').length,
          closed: companies.filter(c => c.status === 'closed').length
        },
        byIndustry,
        byPackage
      },
      eligibilityAnalysis: {
        eligibleCompanies,
        notEligibleCompanies,
        byReason
      },
      skillAnalysis: {
        allRequiredSkills,
        possessedSkills,
        missingSkills,
        categoryWise: {
          technical: { required: technicalRequired, possessed: technicalPossessed },
          soft: { required: softRequired, possessed: softPossessed },
          domain: { required: 0, possessed: 0 }
        }
      },
      applicationStats: appStats,
      recommendations
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error loading analytics' });
  }
});

// @route  GET /api/placement/students  (faculty/admin only)
// @desc   Get all students with placement status
// @access Private
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const applications = await Application.find().populate('company', 'name package');

    const result = students.map(s => {
      const apps = applications.filter(a => a.student.toString() === s._id.toString());
      return {
        ...s.toObject(),
        applications: apps
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
