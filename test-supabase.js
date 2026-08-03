const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://gioxgsgiihqtbtbljnil.supabase.co', 'sb_publishable_nQlLJaj1mr2XdhA7YZFl2w_0_hGf_57');

async function run() {
  console.log("Saving test data...");
  const { error: saveErr } = await supabase.from('rearmc_kv').upsert({ key: 'rearmc:profiles', value: { TestUser: { tag: "TESTER" } } });
  if (saveErr) {
    console.error("SAVE ERROR:", saveErr);
    return;
  }
  
  console.log("Reading test data...");
  const { data, error: readErr } = await supabase.from('rearmc_kv').select('value').eq('key', 'rearmc:profiles').single();
  if (readErr) {
    console.error("READ ERROR:", readErr);
    return;
  }
  
  console.log("SUCCESS! Data:", data);
}

run();
