// ========================================
// PLACEMENT PORTAL - SEED DATA
// Run this to populate your database with sample companies
// ========================================

// Open MongoDB terminal and run: mongosh
// Then type: use smart-campus
// Then copy and paste everything below:

// Clear existing companies
db.companies.deleteMany({})

// Add sample companies
db.companies.insertMany([
    {
        name: "Google",
        industry: "Technology",
        location: "Bangalore",
        package: { min: 45, max: 60, currency: "INR" },
        eligibility: {
            minCgpa: 8.0,
            allowedBranches: ["CSE", "ECE", "IT"],
            maxBacklogs: 0,
            allowedYears: ["2025"]
        },
        skillsRequired: [
            { skill: "Data Structures", importance: "mandatory" },
            { skill: "Algorithms", importance: "mandatory" },
            { skill: "Python", importance: "preferred" }
        ],
        jobProfile: "Software Engineer",
        registrationDeadline: new Date("2025-04-15"),
        status: "open"
    },
    {
        name: "Microsoft",
        industry: "Technology",
        location: "Hyderabad",
        package: { min: 40, max: 55, currency: "INR" },
        eligibility: {
            minCgpa: 7.5,
            allowedBranches: ["CSE", "IT", "ECE"],
            maxBacklogs: 0,
            allowedYears: ["2025"]
        },
        skillsRequired: [
            { skill: "C++", importance: "mandatory" },
            { skill: "C#", importance: "mandatory" },
            { skill: "SQL", importance: "preferred" }
        ],
        jobProfile: "Software Development Engineer",
        registrationDeadline: new Date("2025-04-10"),
        status: "open"
    },
    {
        name: "Amazon",
        industry: "E-commerce",
        location: "Chennai",
        package: { min: 30, max: 45, currency: "INR" },
        eligibility: {
            minCgpa: 7.0,
            allowedBranches: ["CSE", "ECE", "ME", "EE"],
            maxBacklogs: 1,
            allowedYears: ["2025"]
        },
        skillsRequired: [
            { skill: "Java", importance: "mandatory" },
            { skill: "Spring Boot", importance: "preferred" },
            { skill: "AWS", importance: "preferred" }
        ],
        jobProfile: "SDE Intern + FTE",
        registrationDeadline: new Date("2025-04-05"),
        status: "open"
    },
    {
        name: "Flipkart",
        industry: "E-commerce",
        location: "Bangalore",
        package: { min: 25, max: 35, currency: "INR" },
        eligibility: {
            minCgpa: 7.0,
            allowedBranches: ["CSE", "IT", "ECE"],
            maxBacklogs: 1,
            allowedYears: ["2025"]
        },
        skillsRequired: [
            { skill: "Java", importance: "mandatory" },
            { skill: "React", importance: "preferred" }
        ],
        jobProfile: "Software Developer",
        registrationDeadline: new Date("2025-04-20"),
        status: "upcoming"
    },
    {
        name: "TCS",
        industry: "IT Services",
        location: "Multiple",
        package: { min: 7, max: 12, currency: "INR" },
        eligibility: {
            minCgpa: 6.5,
            allowedBranches: ["CSE", "ECE", "ME", "CE", "EE", "IT"],
            maxBacklogs: 2,
            allowedYears: ["2025", "2026"]
        },
        skillsRequired: [
            { skill: "Java", importance: "preferred" },
            { skill: "SQL", importance: "preferred" },
            { skill: "Communication", importance: "mandatory" }
        ],
        jobProfile: "System Engineer",
        registrationDeadline: new Date("2025-05-01"),
        status: "open"
    },
    {
        name: "Infosys",
        industry: "IT Services",
        location: "Multiple",
        package: { min: 6.5, max: 10, currency: "INR" },
        eligibility: {
            minCgpa: 6.0,
            allowedBranches: ["CSE", "ECE", "IT", "ME", "EE"],
            maxBacklogs: 2,
            allowedYears: ["2025", "2026"]
        },
        skillsRequired: [
            { skill: "Python", importance: "preferred" },
            { skill: "SQL", importance: "preferred" },
            { skill: "Communication", importance: "mandatory" }
        ],
        jobProfile: "Systems Engineer",
        registrationDeadline: new Date("2025-05-05"),
        status: "open"
    }
])

print("✅ Added " + db.companies.count() + " companies!")