javascript:(function() {
  // Get user input from selection or prompt
  let input = (window.getSelection ? String(window.getSelection()).trim() : "") || prompt("Enter lookup value (Event ID, IP, domain, hash, case ID or range)");
  if (!input) return;
  input = input.trim();

  const digitsOnly = input.replace(/\D/g, "");

  // Dictionary for known Event IDs
  const socDictionary = {
    "4624": "An account was successfully logged on. Useful for spotting normal vs. suspicious logons.",
    "4625": "An account failed to log on. Commonly linked to brute force attempts or misconfigurations.",
    "4634": "An account was logged off.",
    "4648": "A logon was attempted using explicit credentials (e.g. runas).",
    "4688": "A new process has been created. Critical for tracking execution chains.",
    "4689": "A process has exited.",
    "4672": "Special privileges were assigned to a new logon. Watch for admin or service accounts.",
    "4776": "The domain controller attempted to validate the credentials for an account."
  };

  // Helper: Show popup message
  function showPopup(message) {
    const popup = document.createElement("div");
    popup.style = "position:fixed;top:10%;left:50%;transform:translateX(-50%);background:#1e1e1e;color:#fff;padding:15px;border:2px solid #888;border-radius:8px;z-index:999999;font-family:monospace;max-width:480px;white-space:pre-wrap;";
    popup.textContent = message + "\n\n(click to close)";
    popup.onclick = () => popup.remove();
    document.body.appendChild(popup);
  }

  // Case 1: Range of numbers (e.g. "5-10" or "5 10")
  if (/^\d+\s*[-\s]\s*\d+$/.test(input)) {
    let parts = input.split(/[-\s]+/);
    let start = parseInt(parts[0]), end = parseInt(parts[1]);
    if (isNaN(start) || isNaN(end)) {
      console.log("Please enter valid numbers");
      return;
    }
    if (start >= end) {
      console.log("Starting number cannot be larger than ending number");
      return;
    }
    let range = [];
    for (let i = start; i <= end; i++) range.push(i);
    console.log(range.join(", "));
    navigator.clipboard.writeText(range.join(", "))
      .then(() => console.log("Copied to clipboard"))
      .catch(err => console.log("Failed to copy: " + err));
  }

  // Case 2: Event ID (4-digit number)
  else if (/^\d{4}$/.test(input)) {
    const description = socDictionary[input] || `No entry found for Event ID ${input}`;
    showPopup(`[Event ID] ${input} → ${description}`);
  }

  // Case 3: Case ID (6-digit number)
  else if (/^\d{6}$/.test(digitsOnly)) {
    window.open(`https://xsoar.group.euroclear.com/#/incident/${digitsOnly}`, "_blank");
  }

  // Case 4: IP address
  else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(input)) {
    window.open(`https://www.virustotal.com/gui/ip-address/${input}`, "_blank");
  }

  // Case 5: Domain name
  else if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(input)) {
    window.open(`https://www.virustotal.com/gui/domain/${input}`, "_blank");
  }

  // Case 6: Hash (MD5/SHA1/SHA256)
  else if (/^[a-fA-F0-9]{32,}$/.test(input)) {
    window.open(`https://www.virustotal.com/gui/file/${input}`, "_blank");
  }

  // Default: Unrecognized input
  else {
    showPopup(`Unrecognized input: '${input}' (length ${input.length})`);
  }
})();


