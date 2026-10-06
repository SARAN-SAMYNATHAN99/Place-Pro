const db = require('./src/config/db');

const newQuestions = [
    {
        category: 'HR Interview',
        question: 'Where do you see yourself in 5 years?',
        expected_answer: 'I see myself taking on more leadership responsibilities, mentoring junior developers, and contributing to high-impact architectural decisions while continually deepening my technical expertise.',
        tips: 'Focus on growth, alignment with the company goals, and a desire to take on responsibility.',
        difficulty: 'Easy'
    },
    {
        category: 'HR Interview',
        question: 'Why should we hire you?',
        expected_answer: 'You should hire me because I have a strong foundation in the required technologies, a proven ability to learn quickly, and a passion for solving complex problems. My teamwork and communication skills will make me a great fit for your culture.',
        tips: 'Combine your technical skills with soft skills. Be confident but not arrogant.',
        difficulty: 'Medium'
    },
    {
        category: 'Technical Interview',
        question: 'Explain the difference between SQL and NoSQL databases.',
        expected_answer: 'SQL databases are relational, use structured schemas, and scale vertically. NoSQL databases are non-relational, flexible schemas, document or key-value based, and scale horizontally.',
        tips: 'Mention structure (relational vs non-relational) and scaling (vertical vs horizontal).',
        difficulty: 'Medium'
    },
    {
        category: 'Technical Interview',
        question: 'What is a RESTful API?',
        expected_answer: 'A RESTful API is an architectural style for an application program interface that uses HTTP requests to access and use data. It relies on stateless, client-server communication and standard HTTP methods like GET, POST, PUT, and DELETE.',
        tips: 'Key points to include: HTTP methods, statelessness, and client-server architecture.',
        difficulty: 'Medium'
    },
    {
        category: 'Technical Interview',
        question: 'What is the difference between let, const, and var in JavaScript?',
        expected_answer: 'var is function-scoped and hoisted. let and const are block-scoped. let allows reassignment, while const prevents reassignment of the variable identifier.',
        tips: 'Focus on scoping rules (block vs function) and reassignment capabilities.',
        difficulty: 'Easy'
    },
    {
        category: 'Technical Interview',
        question: 'Explain the concept of normalization in databases.',
        expected_answer: 'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships between them using normal forms like 1NF, 2NF, and 3NF.',
        tips: 'Mention reducing redundancy, data integrity, and normal forms.',
        difficulty: 'Hard'
    },
    {
        category: 'HR Interview',
        question: 'Tell me about a time you faced a difficult challenge and how you overcame it.',
        expected_answer: 'I once faced a tight deadline where our main server crashed. I communicated the issue immediately to stakeholders, collaborated with my team to isolate the hardware failure, and migrated our services to a backup cloud instance, meeting the deadline.',
        tips: 'Use the STAR method: Situation, Task, Action, Result.',
        difficulty: 'Hard'
    },
    {
        category: 'Technical Interview',
        question: 'What are SOLID principles?',
        expected_answer: 'SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They are design principles intended to make software designs more understandable, flexible, and maintainable.',
        tips: 'List the 5 principles and their general purpose in object-oriented design.',
        difficulty: 'Hard'
    }
];

(async () => {
    try {
        for (let q of newQuestions) {
            await db.query(
                'INSERT INTO mock_interviews (category, question, expected_answer, tips, difficulty) VALUES (?, ?, ?, ?, ?)',
                [q.category, q.question, q.expected_answer, q.tips, q.difficulty]
            );
        }
        console.log('Inserted new mock interview questions.');
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
})();
