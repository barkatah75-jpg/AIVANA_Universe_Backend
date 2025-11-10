const db = require("../db");

module.exports = async function processTrials(){
  const res = await db.query(`
    SELECT id, user_id FROM subscriptions
    WHERE status IN ('trialing','active') AND trial_ends_at IS NOT NULL AND trial_ends_at <= now()
  `);
  for (const row of res.rows){
    await db.query("UPDATE subscriptions SET status=$1 WHERE id=$2", ["past_due", row.id]);
    console.log("Marked subscription past_due id=", row.id);
  }
  return true;
};
