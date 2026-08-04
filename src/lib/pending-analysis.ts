/**
 * Hand-off between the analyze form and the processing screen.
 *
 * The submission contains File objects, which cannot be serialised into
 * sessionStorage or a URL — so it is held in module scope for the single
 * navigation between the two pages and cleared as soon as it is consumed.
 *
 * A refresh on /processing therefore finds nothing pending, which is the correct
 * outcome: that page redirects back to the form rather than re-submitting.
 */
let pending: FormData | null = null;

export function setPendingAnalysis(form: FormData): void {
  pending = form;
}

/** Returns the pending submission and clears it, so it can never be sent twice. */
export function takePendingAnalysis(): FormData | null {
  const value = pending;
  pending = null;
  return value;
}

export function hasPendingAnalysis(): boolean {
  return pending !== null;
}
