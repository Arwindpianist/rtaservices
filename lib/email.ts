type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

async function sendWithResend(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  }).catch(() => null);
  return !!res?.ok;
}

export async function sendInviteEmail(input: {
  to: string;
  inviteLink: string;
  tenantName: string;
}): Promise<boolean> {
  const subject = `${input.tenantName} Invitation`;
  const text = `You are invited to join ${input.tenantName}.\n\nOpen this link to activate your account:\n${input.inviteLink}`;
  const html = `<p>You are invited to join <strong>${input.tenantName}</strong>.</p><p><a href="${input.inviteLink}">Activate your account</a></p>`;
  return sendWithResend({ to: input.to, subject, text, html });
}

export async function sendPasswordResetEmail(input: {
  to: string;
  resetLink: string;
  tenantName: string;
}): Promise<boolean> {
  const subject = `${input.tenantName} Password Reset`;
  const text = `Reset your password for ${input.tenantName}:\n${input.resetLink}`;
  const html = `<p>Reset your password for <strong>${input.tenantName}</strong>.</p><p><a href="${input.resetLink}">Reset password</a></p>`;
  return sendWithResend({ to: input.to, subject, text, html });
}
