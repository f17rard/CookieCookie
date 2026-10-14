import { useEffect, useState, type FormEvent } from "react";

const PRICE_PER_COOKIE_CENTS = 150;
const STORAGE_KEY = "cookie-cookie-sales";
const COST_PER_COOKIE_CENTS = 42;

type PaymentMethod = "Efectivo" | "Transferencia";

type Sale = {
  id: string;
  customerName: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  amountPaidCents: number;
  createdAt: string;
};

type StoredSales = {
  sales: Sale[];
  canPersist: boolean;
  issue: string | null;
};

function isSale(value: unknown): value is Sale {
  if (typeof value !== "object" || value === null) return false;
  const sale = value as Record<string, unknown>;

  return (
    typeof sale.id === "string" &&
    typeof sale.customerName === "string" &&
    typeof sale.quantity === "number" &&
    Number.isInteger(sale.quantity) &&
    sale.quantity > 0 &&
    (sale.paymentMethod === "Efectivo" ||
      sale.paymentMethod === "Transferencia") &&
    typeof sale.amountPaidCents === "number" &&
    Number.isInteger(sale.amountPaidCents) &&
    sale.amountPaidCents >= 0 &&
    typeof sale.createdAt === "string"
  );
}

function loadSales(): StoredSales {
  try {
    const savedSales = localStorage.getItem(STORAGE_KEY);
    if (savedSales === null) return { sales: [], canPersist: true, issue: null };

    const parsed: unknown = JSON.parse(savedSales);
    if (!Array.isArray(parsed) || !parsed.every(isSale)) {
      return {
        sales: [],
        canPersist: false,
        issue: "Los datos guardados no tienen un formato válido.",
      };
    }

    return { sales: parsed, canPersist: true, issue: null };
  } catch {
    return {
      sales: [],
      canPersist: false,
      issue: "No se pudieron leer las ventas guardadas en este navegador.",
    };
  }
}

function formatMoney(cents: number): string {
  const amount = (cents / 100).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${amount}`;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getSaleTotal(sale: Sale): number {
  return sale.quantity * PRICE_PER_COOKIE_CENTS;
}

function App() {
  const [storedSales, setStoredSales] = useState(loadSales);
  const { sales, issue } = storedSales;
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Efectivo");
  const [amountPaid, setAmountPaid] = useState("");
  const [formError, setFormError] = useState("");
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    if (!storedSales.canPersist) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
      setStorageError(null);
    } catch {
      setStorageError(
        "No se pudieron guardar los cambios en este navegador. Tus ventas estarán disponibles hasta que cierres esta página.",
      );
    }
  }, [sales, storedSales.canPersist]);

  const totalCookies = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalSalesCents = sales.reduce(
    (sum, sale) => sum + getSaleTotal(sale),
    0,
  );
  const totalPaidCents = sales.reduce(
    (sum, sale) => sum + sale.amountPaidCents,
    0,
  );
  const totalDueCents = totalSalesCents - totalPaidCents;
  const parsedQuantity = Number(quantity);
  const saleTotalCents =
    Number.isInteger(parsedQuantity) && parsedQuantity > 0
      ? parsedQuantity * PRICE_PER_COOKIE_CENTS
      : 0;
  const parsedAmount = amountPaid === "" ? 0 : Number(amountPaid);
  const amountPaidCents = Number.isFinite(parsedAmount)
    ? Math.round(parsedAmount * 100)
    : 0;
  const currentDueCents = Math.max(0, saleTotalCents - amountPaidCents);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const name = customerName.trim();
    if (!name) {
      setFormError("Escribe el nombre de la persona.");
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setFormError("La cantidad debe ser un número entero mayor que cero.");
      return;
    }

    if (
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0 ||
      amountPaidCents > saleTotalCents
    ) {
      setFormError("El pago debe ser igual o menor al total de la venta.");
      return;
    }

    const newSale: Sale = {
      id: crypto.randomUUID(),
      customerName: name,
      quantity: parsedQuantity,
      paymentMethod,
      amountPaidCents,
      createdAt: new Date().toISOString(),
    };

    setStoredSales((previous) => ({
      ...previous,
      sales: [newSale, ...previous.sales],
    }));
    setCustomerName("");
    setQuantity("");
    setPaymentMethod("Efectivo");
    setAmountPaid("");
  }

  function deleteSale(id: string) {
    setStoredSales((previous) => ({
      ...previous,
      sales: previous.sales.filter((sale) => sale.id !== id),
    }));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="CookieCookie, inicio">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M30.8 21.2a12.1 12.1 0 1 1-12-12.1c-.8 5.4 3.6 9.8 9 9.8 1 0 2-.1 3-.5v2.8Z"
                fill="currentColor"
              />
              <circle cx="14" cy="18" r="1.6" fill="#fff8ed" />
              <circle cx="21" cy="28" r="1.7" fill="#fff8ed" />
              <circle cx="26" cy="23" r="1.2" fill="#fff8ed" />
              <circle cx="30" cy="10" r="5" fill="#e3a348" />
            </svg>
          </span>
          <span className="brand-name">cookie<span>cookie</span></span>
        </a>
        <div className="topbar-right">
          <span className="today-label">Tu espacio de ventas</span>
          <span className="avatar" aria-label="Mi negocio">G</span>
        </div>
      </header>

      <div className="content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">TU NEGOCIO, EN ORDEN</p>
            <h1>Ventas</h1>
            <p className="heading-copy">
              Registra tus ventas y mantén tus cuentas al día.
            </p>
          </div>
          <div className="price-note">
            <span className="price-cookie" aria-hidden="true">✳</span>
            <span>Precio por galleta<strong>$1.50</strong></span>
          </div>
        </section>

        {(issue || storageError) && (
          <p className="storage-message" role="alert">{issue ?? storageError}</p>
        )}

        <section className="summary-grid" aria-label="Resumen de ventas">
          <article className="summary-card">
            <div className="summary-top">
              <span className="summary-label">Galletas vendidas</span>
              <span className="summary-icon icon-cookie" aria-hidden="true">✳</span>
            </div>
            <strong className="summary-value">{totalCookies}</strong>
            <span className="summary-caption">en {sales.length} ventas</span>
          </article>
          <article className="summary-card">
            <div className="summary-top">
              <span className="summary-label">Total de ventas</span>
              <span className="summary-icon icon-sales" aria-hidden="true">$</span>
            </div>
            <strong className="summary-value">{formatMoney(totalSalesCents)}</strong>
            <span className="summary-caption">monto total vendido</span>
          </article>
          <article className="summary-card">
            <div className="summary-top">
              <span className="summary-label">Total cobrado</span>
              <span className="summary-icon icon-paid" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="m4 10 4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <strong className="summary-value">{formatMoney(totalPaidCents)}</strong>
            <span className="summary-caption">dinero recibido</span>
          </article>
          <article className="summary-card due-card">
            <div className="summary-top">
              <span className="summary-label">Por cobrar</span>
              <span className="summary-icon icon-due" aria-hidden="true">↗</span>
            </div>
            <strong className="summary-value">{formatMoney(totalDueCents)}</strong>
            <span className="summary-caption">saldo pendiente</span>
          </article>
        </section>

        <section className="workspace">
          <section className="sales-panel">
            <div className="section-heading">
              <div>
                <h2>Registro de ventas</h2>
                <p>Un vistazo a las ventas de tu negocio.</p>
              </div>
              <span className="sale-count">{sales.length} {sales.length === 1 ? "venta" : "ventas"}</span>
            </div>

            {sales.length === 0 ? (
              <div className="empty-state">
                <span className="empty-illustration" aria-hidden="true">
                  <svg viewBox="0 0 64 64" fill="none">
                    <path d="M48.7 34.4a19.3 19.3 0 1 1-19.1-19.3c-1.3 8.6 5.7 15.6 14.3 15.6 1.7 0 3.3-.3 4.8-.8v4.5Z" fill="#D9A45C" />
                    <circle cx="22" cy="29" r="2.5" fill="#fff8ed" />
                    <circle cx="34" cy="43" r="2.5" fill="#fff8ed" />
                    <circle cx="40" cy="26" r="2" fill="#fff8ed" />
                    <path d="M46 12v10M41 17h10" stroke="#75947D" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
                <h3>Aquí aparecerán tus ventas</h3>
                <p>Cuando registres tu primera venta, la verás aquí.</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PERSONA</th>
                      <th>FECHA</th>
                      <th>GALLETAS</th>
                      <th>TOTAL</th>
                      <th>PAGO</th>
                      <th>ESTADO</th>
                      <th><span className="visually-hidden">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => {
                      const dueCents = getSaleTotal(sale) - sale.amountPaidCents;
                      return (
                        <tr key={sale.id}>
                          <td className="customer-cell">{sale.customerName}</td>
                          <td>{formatDate(sale.createdAt)}</td>
                          <td>{sale.quantity}</td>
                          <td className="money-cell">{formatMoney(getSaleTotal(sale))}</td>
                          <td>
                            <span className="payment-method">
                              <span className={`method-dot ${sale.paymentMethod === "Efectivo" ? "cash-dot" : "transfer-dot"}`} />
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td>
                            {dueCents === 0 ? (
                              <span className="status status-paid">Pagado</span>
                            ) : sale.amountPaidCents > 0 ? (
                              <span className="status status-partial">Debe {formatMoney(dueCents)}</span>
                            ) : (
                              <span className="status status-due">Debe {formatMoney(dueCents)}</span>
                            )}
                          </td>
                          <td>
                            <button
                              className="delete-button"
                              type="button"
                              aria-label={`Eliminar venta de ${sale.customerName}`}
                              onClick={() => deleteSale(sale.id)}
                            >
                              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="M4 6h12M8 6V4h4v2m3 0-.7 10H5.7L5 6m3 3v4m4-4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className="form-panel">
            <div className="form-heading">
              <span className="form-heading-icon" aria-hidden="true">＋</span>
              <div>
                <h2>Nueva venta</h2>
                <p>Agrega una venta a tu registro.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <label className="field-label" htmlFor="customer-name">Nombre de la persona</label>
              <input
                id="customer-name"
                autoComplete="name"
                placeholder="Ej. Ana García"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
              />

              <label className="field-label" htmlFor="quantity">Cantidad de galletas</label>
              <div className="input-with-suffix">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="0"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
                <span>galletas</span>
              </div>

              <div className="calculation-row">
                <span>Total de la venta</span>
                <strong>{formatMoney(saleTotalCents)}</strong>
              </div>

              <fieldset className="payment-fieldset">
                <legend>Método de pago</legend>
                <div className="payment-options">
                  {(["Efectivo", "Transferencia"] as const).map((method) => (
                    <button
                      className={`payment-option ${paymentMethod === method ? "selected" : ""}`}
                      type="button"
                      key={method}
                      aria-pressed={paymentMethod === method}
                      onClick={() => setPaymentMethod(method)}
                    >
                      <span className={`option-icon ${method === "Efectivo" ? "cash-icon" : "transfer-icon"}`} aria-hidden="true">
                        {method === "Efectivo" ? "$" : "↗"}
                      </span>
                      {method}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="field-label" htmlFor="amount-paid">¿Cuánto te pagó?</label>
              <div className="input-with-prefix">
                <span>$</span>
                <input
                  id="amount-paid"
                  type="number"
                  min="0"
                  max={saleTotalCents / 100}
                  step="0.01"
                  placeholder="0.00"
                  value={amountPaid}
                  onChange={(event) => setAmountPaid(event.target.value)}
                />
              </div>

              <div className={`due-preview ${currentDueCents > 0 ? "has-due" : "is-paid"}`}>
                <span>{currentDueCents > 0 ? "Queda pendiente" : "Saldo pendiente"}</span>
                <strong>{formatMoney(currentDueCents)}</strong>
              </div>

              {formError && <p className="form-error" role="alert">{formError}</p>}

              <button className="submit-button" type="submit">
                <span>Registrar venta</span>
                <span aria-hidden="true">→</span>
              </button>
              <p className="form-footnote">El precio por galleta es de $1.50.</p>
            </form>
          </aside>
        </section>

        <footer className="page-footer">
          <span>Hecho con cariño para tu negocio <span aria-hidden="true">♡</span></span>
          <span>Control de ventas</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
