const db = require('./src/config/db');

async function update() {
    try {
        // Delete problematic companies
        await db.pool.query("DELETE FROM companies WHERE name IN ('TCS', 'HCL', 'Zoho')");

        // Insert new tier-varied companies
        const newCompanies = [
            {
                name: 'IBM',
                logo_url: '', // Ignored, frontend uses clearbit
                package: '4.5 - 9.0 LPA',
                eligibility: '65% throughout in 10th, 12th, and UG',
                skills_required: 'Java, Python, Cloud Computing, SQL',
                hiring_process: '1. Cognitive Test 2. Coding Test 3. English Language Test 4. Interview'
            },
            {
                name: 'Cisco',
                logo_url: '',
                package: '12.0 - 17.0 LPA',
                eligibility: '70% in UG, no active backlogs',
                skills_required: 'C++, Python, Networking, OS',
                hiring_process: '1. Online Assessment 2. Technical Interview 1 3. Technical Interview 2 4. HR Interview'
            },
            {
                name: 'Microsoft',
                logo_url: '',
                package: '40.0 - 45.0 LPA',
                eligibility: '75% throughout, strong DSA',
                skills_required: 'DSA, System Design, C++/Java/C#',
                hiring_process: '1. Online Coding 2. Technical Round 1 3. Technical Round 2 4. System Design 5. AA Round'
            },
            {
                name: 'Uber',
                logo_url: '',
                package: '35.0 - 50.0 LPA',
                eligibility: 'Excellent problem solving skills',
                skills_required: 'DSA, Advanced System Design, Node.js/Go',
                hiring_process: '1. Online Assessment 2. Phone Screen 3. DSA Interview 4. Machine Coding 5. HR'
            },
            {
                name: 'Meta',
                logo_url: '',
                package: '45.0 - 55.0 LPA',
                eligibility: 'Top tier coding skills',
                skills_required: 'React, C++, System Design, Scalability',
                hiring_process: '1. Phone Screen 2. Coding Interview 1 3. Coding Interview 2 4. System Design 5. Behavioral'
            }
        ];

        for (const c of newCompanies) {
            await db.pool.query(
                'INSERT INTO companies (name, logo_url, package, eligibility, skills_required, hiring_process) VALUES ($1, $2, $3, $4, $5, $6)',
                [c.name, c.logo_url, c.package, c.eligibility, c.skills_required, c.hiring_process]
            );
        }
        
        console.log("Database updated successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
update();
