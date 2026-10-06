const db = require('./src/config/db');

async function seed() {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const topics = ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Math', 'Greedy', 'Backtracking', 'Sorting'];
    
    try {
        await db.pool.query('TRUNCATE TABLE coding_questions RESTART IDENTITY');
        
        const queries = [];
        
        for (let d of difficulties) {
            for (let i = 1; i <= 40; i++) {
                const topic = topics[Math.floor(Math.random() * topics.length)];
                const title = `${topic} Challenge ${i} - ${d}`;
                const description = `This is a standard ${d.toLowerCase()} level problem focusing on ${topic}. Given a standard input, implement an optimal solution to achieve the desired output. Make sure to consider edge cases like empty inputs or negative numbers.`;
                const input = `nums = [1, 2, 3, 4, 5], target = 9`;
                const output = `[3, 4]`;
                const hint = `Try thinking about how ${topic} data structures handle this scenario efficiently. Can you optimize the time complexity?`;
                const java = `class Solution {\n    public void solve() {\n        // Your ${d} Java solution for ${topic}\n    }\n}`;
                const py = `class Solution:\n    def solve(self):\n        # Your ${d} Python solution for ${topic}\n        pass`;
                const cpp = `class Solution {\npublic:\n    void solve() {\n        // Your ${d} C++ solution for ${topic}\n    }\n};`;
                
                queries.push(db.pool.query(
                    'INSERT INTO coding_questions (title, description, difficulty, example_input, example_output, hints, solution_java, solution_python, solution_cpp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                    [title, description, d, input, output, hint, java, py, cpp]
                ));
            }
        }
        
        await Promise.all(queries);
        console.log("Successfully seeded 120 coding questions.");
    } catch(e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

seed();
