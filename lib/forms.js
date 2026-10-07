export const FORMS = {
  pearlshire: {
    id: "pearlshire",
    title: "PEARLSHIRE DEVELOPERS - DEMO",
    username: "pearlshire",
    password: "Wegrowtogether@yo1",
    webhookUrl: "https://hook.us2.make.com/hovwbcemwqtyyjlcglcme5d4jl7uloop",
  },
  elysian: {
    id: "elysian",
    title: "ELYSIAN REAL ESTATE - INQUIRY",
    username: "elysian",
    password: "Wegrowtogether@yo1",
    webhookUrl: "https://hook.eu1.make.com/vq2zg5z4fhc8mm3kcwpnv82cbvtts6my",
  },
  forex: {
    id: "forex",
    title: "FOREX DEMO",
    username: "forex",
    password: "Wegrowtogetherpyo1",
    passwords: ["Wegrowtogetherpyo1", "Wegrowtogether@yo1"],
    webhookUrl: "https://hook.eu1.make.com/1trabyzak4w1kravj35w3z8kyn6ke2jo",
    aliases: ["forexdemo", "forex-demo"],
  },
  vizz: {
    id: "vizz",
    title: "VIZZ REAL ESTATE",
    username: "vizz",
    password: "Wegrowtogether@yo1",
    passwords: ["Wegrowtogether@yo1", "Wegrowtogetherpyo1"],
    webhookUrl: "https://hook.eu1.make.com/j31mthjlgf3x2lapj5g8qikx65a8s2ji",
    aliases: ["vizzrealestate", "vizz-real-estate"],
    chatWidget: {
      publicKey: "key_a09da61f4dc19bd860c12baafbe8",
      agentId: "agent_76e90e945111f646d90f249206",
      agentVersion: "0",
      title: "Chat with Vizz Heights",
      fabText: "Need help finding a home?",
    },
  },
};

export function getFormById(id) {
  if (!id) return null;
  const normalizedId = id.toLowerCase().trim();
  if (FORMS[normalizedId]) return FORMS[normalizedId];

  for (const form of Object.values(FORMS)) {
    if (
      form.aliases &&
      form.aliases.some((alias) => alias.toLowerCase() === normalizedId)
    ) {
      return form;
    }
  }
  return null;
}

export function authenticateForm(username, password) {
  if (!username || !password) return null;
  const normalizedUser = username.toLowerCase().trim();
  
  for (const form of Object.values(FORMS)) {
    const isUserMatch =
      form.username.toLowerCase() === normalizedUser ||
      (form.aliases &&
        form.aliases.some((alias) => alias.toLowerCase() === normalizedUser));
    const isPassMatch =
      form.password === password ||
      (form.passwords && form.passwords.includes(password));
    if (isUserMatch && isPassMatch) {
      return form;
    }
  }
  return null;
}
