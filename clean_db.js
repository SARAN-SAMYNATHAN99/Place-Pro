const db = require('./src/config/db');

async function clean() {
    try {
        await db.pool.query(`
            DELETE FROM companies
            WHERE id NOT IN (
                SELECT MIN(id)
                FROM companies
                GROUP BY name
            )
        `);
        console.log("Duplicates removed.");
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
clean();
