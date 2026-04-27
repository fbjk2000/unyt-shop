import { buildMetadata } from "@/lib/metadata";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TransferIntake } from "@/components/transfer/transfer-intake";

const transferSteps = [
  {
    step: "01",
    title: "Informieren",
    status: "Jetzt verfügbar",
    tone: "live",
    body: "Diese Seite erklärt den aktuellen Transferstand, die Vorbereitung und die nächsten unterstützten Schritte.",
  },
  {
    step: "02",
    title: "MetaMask vorbereiten",
    status: "Jetzt verfügbar",
    tone: "live",
    body: "Richten Sie Ihr persönliches Wallet in Ruhe ein. Die Anleitung unten führt Sie ohne technische Vorkenntnisse durch die Einrichtung.",
  },
  {
    step: "03",
    title: "Wallet-Adresse bestätigen",
    status: "Jetzt verfügbar",
    tone: "live",
    body: "Sie können Ihre öffentliche MetaMask-Adresse einreichen und per Signatur bestätigen. Das beweist Kontrolle über die Adresse, löst aber keine Übertragung aus.",
  },
  {
    step: "04",
    title: "Wallet zuordnen lassen",
    status: "Datenimport bereit",
    tone: "assisted",
    body: "Der Import bestehender Supporter-/Backer-Daten ist vorbereitet. Die Zuordnung wird kontrolliert geprüft. Bitte senden Sie keine Recovery Phrase und keine privaten Schlüssel.",
  },
  {
    step: "05",
    title: "Übertragung bestätigen",
    status: "Nächster Schritt",
    tone: "next",
    body: "Die eigentliche Transferausführung wird erst geöffnet, wenn Zuordnung, Prüfung und Bestätigung sauber zusammenlaufen.",
  },
  {
    step: "06",
    title: "Bestand und Status einsehen",
    status: "Teilweise live",
    tone: "assisted",
    body: "Ihre Transferreferenz kann auf dieser Seite geprüft werden. On-chain Transaktionsstatus wird erst nach realer Ausführung ergänzt.",
  },
] as const;

const metamaskSteps = [
  {
    title: "MetaMask installieren",
    body: "Öffnen Sie metamask.io am Computer, wählen Sie Ihren Browser aus und fügen Sie die Erweiterung hinzu.",
  },
  {
    title: "Symbol sichtbar machen",
    body: "Öffnen Sie im Browser die Erweiterungen und heften Sie MetaMask an. So finden Sie das Wallet später wieder.",
  },
  {
    title: "Neues Wallet erstellen",
    body: "Starten Sie MetaMask, stimmen Sie den Grundbedingungen zu und wählen Sie die Einrichtung eines neuen Wallets.",
  },
  {
    title: "Nicht Google oder Apple verwenden",
    body: "Wählen Sie nicht die Google-/Apple-Abkürzung. Nutzen Sie den Weg über die geheime Wiederherstellungsphrase.",
    critical: true,
  },
  {
    title: "Passwort festlegen",
    body: "Erstellen Sie ein starkes Passwort. Es schützt den Zugriff auf diesem Gerät, ersetzt aber nicht die Recovery Phrase.",
  },
  {
    title: "12 Wörter auf Papier sichern",
    body: "Schreiben Sie die 12 Wörter exakt und in richtiger Reihenfolge auf Papier. Nicht fotografieren, nicht digital speichern, nicht teilen.",
    critical: true,
  },
  {
    title: "Wörter bestätigen",
    body: "MetaMask fragt einzelne Wörter ab. Wählen Sie die richtigen Wörter aus Ihrer Papiernotiz aus.",
  },
  {
    title: "Wallet öffnen",
    body: "Nach der Bestätigung ist Ihr Wallet bereit. Für die weitere UNYT-Zuordnung brauchen Sie später nur Ihre öffentliche Wallet-Adresse.",
  },
] as const;

const nowCards = [
  {
    label: "Verfügbar jetzt",
    title: "Vorbereitung und Orientierung",
    items: [
      "Transferablauf nachvollziehen",
      "MetaMask sicher vorbereiten",
      "Supporter-Daten und bisherige E-Mail-Adresse bereithalten",
      "Öffentliche Wallet-Adresse per MetaMask-Signatur bestätigen",
      "Bei Unsicherheit Unterstützung anfordern",
    ],
  },
  {
    label: "Assistiert / manuell",
    title: "Zuordnung und Prüfung",
    items: [
      "Wallet-Adresse mit bestehendem Supporter-Datensatz abgleichen",
      "Unklare Fälle durch Support prüfen lassen",
      "Keine privaten Schlüssel, Seed Phrases oder Passwörter einsenden",
    ],
  },
  {
    label: "Kommt als nächstes",
    title: "Transferausführung und Status",
    items: [
      "Import der realen Supporter- und Backer-Daten",
      "Admin-Prüfung und Freigabe vor tatsächlicher Übertragung",
      "Transaktionsbestätigung nach realer Ausführung",
    ],
  },
] as const;

const faqs = [
  {
    question: "Muss ich MetaMask sofort einrichten?",
    answer:
      "Nein. Sie können zuerst die Schritte lesen. MetaMask ist aber die empfohlene Vorbereitung, damit die spätere Wallet-Zuordnung nicht unter Zeitdruck passiert.",
  },
  {
    question: "Darf ich meine 12 Wörter an den Support schicken?",
    answer:
      "Nein. Die 12 Wörter sind Ihr Generalschlüssel. Niemand aus dem UNYT- oder Fintery-Team wird danach fragen. Teilen Sie niemals Recovery Phrase, private Schlüssel oder Passwörter.",
  },
  {
    question: "Ist die Übertragung schon vollständig automatisiert?",
    answer:
      "Nein. Diese Seite ist bewusst ehrlich: Vorbereitung und Orientierung sind live, Zuordnung und Prüfung werden unterstützt, die vollständige Transferausführung wird erst geöffnet, wenn sie belastbar bereit ist.",
  },
  {
    question: "Was ist, wenn ich mich mit Wallets nicht auskenne?",
    answer:
      "Dann nutzen Sie den Unterstützungsweg. Der Prozess soll auch für nicht-technische Supporter verständlich bleiben. Richten Sie nichts hastig ein, wenn Sie unsicher sind.",
  },
] as const;

export const metadata = buildMetadata({
  title: "UNYT Transfer | Offizielle Supporter-Übertragung",
  description:
    "Offizielle Transferseite für bestehende UNYT Supporter und Backer mit Vorbereitung, MetaMask-Anleitung, Wallet-Signatur, Status und Support.",
  path: "/transfer",
});

function StatusPill({ tone, children }: { tone: "live" | "assisted" | "next"; children: React.ReactNode }) {
  const className =
    tone === "live"
      ? "border-emerald-300/25 bg-emerald-400/8 text-emerald-100"
      : tone === "assisted"
        ? "border-sky-200/20 bg-sky-300/8 text-sky-100"
        : "border-amber-200/22 bg-amber-300/8 text-amber-100";

  return (
    <span className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

function TransferSection({
  id,
  eyebrow,
  title,
  body,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="shell border-t border-white/8 py-10 sm:py-12 lg:py-14">
      <div className="mb-7 grid gap-4 lg:grid-cols-[240px_minmax(0,760px)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">{eyebrow}</p>
        <div>
          <h2 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-white/62">{body}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function TransferPage() {
  return (
    <>
      <section className="shell relative overflow-hidden bg-[#0b1020] pb-10 pt-10 sm:pb-12 sm:pt-12 lg:pb-14 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_430px] lg:items-start">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-3">
              <BrandLogo variant="mark" className="h-7 w-7 opacity-90" alt="" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/48">transfer.unyt.shop</p>
            </div>
            <h1 className="max-w-4xl text-[clamp(2rem,4.8vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
              Ihr Weg zur sicheren <span className="block sm:inline">UNYT-Übertragung</span>
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/68 sm:text-lg">
              Dies ist die offizielle Transfer- und Supportseite für bestehende UNYT Supporter und Backer.
              Sie werden Schritt für Schritt vorbereitet. Wo ein Schritt noch unterstützt oder manuell ist, wird
              er klar so gekennzeichnet.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="#vorbereiten" variant="brand" className="rounded-lg shadow-none">
                Jetzt vorbereiten
              </Button>
              <Button href="#metamask" variant="secondary" className="rounded-lg">
                MetaMask einrichten
              </Button>
              <Button href="/app/wallet" variant="secondary" className="rounded-lg">
                Transferstatus ansehen
              </Button>
            </div>
            <p className="max-w-2xl border-l-2 border-amber-200/35 pl-4 text-sm leading-6 text-white/58">
              Wichtig: Diese Seite ersetzt keine überstürzte Wallet-Aktion. Sie soll Klarheit schaffen,
              Vorbereitung ermöglichen und sichere Unterstützung sichtbar machen.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-white/10 bg-[#101827] p-5 shadow-none">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Aktueller Stand</p>
                <div className="mt-5 space-y-3">
                  {[
                    ["Information", "Live"],
                    ["Wallet-Vorbereitung", "Live"],
                    ["Wallet-Signatur", "Live"],
                    ["Zuordnung", "Import bereit"],
                    ["Ausführung", "Noch nicht geöffnet"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
                      <span className="text-sm text-white/62">{label}</span>
                      <span className="text-right text-sm font-semibold text-white/86">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-amber-200/20 bg-amber-200/8 p-4">
                  <p className="text-sm font-semibold text-amber-100">Keine Fake-Automation</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Die Signaturprüfung ist live. Die tatsächliche Übertragung wird erst als live angezeigt,
                    wenn technische und organisatorische Abwicklung wirklich bereit sind.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TransferSection
        eyebrow="Warum diese Seite"
        title="Der Transfer soll geordnet, nachvollziehbar und supporterfreundlich ablaufen."
        body="Die letzte Supporter-Kommunikation hat konkrete Schritte auf transfer.unyt.shop angekündigt. Deshalb ist diese Seite kein allgemeiner Erklärtext, sondern der offizielle Ort für Vorbereitung, Status und Unterstützung."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Klarheit", "Sie sehen, welche Schritte heute möglich sind und welche bewusst noch nicht geöffnet wurden."],
            ["Kontinuität", "Bestehende Supporter- und Backer-Beziehungen bleiben der Ausgangspunkt für die spätere Zuordnung."],
            ["Sicherheit", "Wallet-Vorbereitung wird mit klaren Warnhinweisen erklärt. Niemand soll geheime Daten teilen."],
          ].map(([title, body]) => (
            <Reveal key={title}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-lg font-semibold tracking-[-0.02em] text-white">{title}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </TransferSection>

      <TransferSection
        id="vorbereiten"
        eyebrow="Transfer Journey"
        title="Sechs Schritte, mit ehrlichem Status."
        body="Die Übertragung ist ein geführter Prozess. Vorbereitung ist möglich, assistierte Zuordnung ist vorgesehen, die tatsächliche Ausführung wird nicht als live dargestellt, solange sie nicht live ist."
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {transferSteps.map((item, index) => (
            <Reveal key={item.step} delay={index * 0.03}>
              <article className="h-full rounded-xl border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-white/38">{item.step}</span>
                  <StatusPill tone={item.tone}>{item.status}</StatusPill>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </TransferSection>

      <TransferSection
        id="metamask"
        eyebrow="MetaMask vorbereiten"
        title="Wallet einrichten, ohne Sicherheitsabkürzung."
        body="Die PDF-Anleitung wurde in eine webfreundliche Schrittfolge übertragen. Der wichtigste Punkt: nicht über Google oder Apple abkürzen, sondern die Recovery-Phrase-Route sauber verwenden."
      >
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Reveal>
            <div className="sticky top-24 rounded-xl border border-white/10 bg-[#101827] p-5">
              <p className="text-sm font-semibold text-white">Was MetaMask hier ist</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                MetaMask ist ein persönliches Browser-Wallet. Es hilft später dabei, eine öffentliche Wallet-Adresse
                für die UNYT-Zuordnung bereitzuhalten. Es bedeutet nicht, dass Sie geheime Schlüssel an uns übertragen.
              </p>
              <div className="mt-5 rounded-lg border border-rose-200/20 bg-rose-300/8 p-4">
                <p className="text-sm font-semibold text-rose-100">Sicherheitsregel</p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Die 12 Wörter niemals digital speichern und niemals teilen. Auch nicht mit UNYT, Fintery oder Support.
                </p>
              </div>
              <a
                href="/downloads/metamask-wallet-einrichtungsanleitung.pdf"
                download
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg border border-white/18 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                PDF-Anleitung herunterladen
              </a>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {metamaskSteps.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.025}>
                <article
                  className={`rounded-xl border p-5 ${
                    "critical" in item && item.critical
                      ? "border-amber-200/24 bg-amber-300/8"
                      : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  <div className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-sm font-semibold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[rgba(255,255,255,0.7)]">{item.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </TransferSection>

      <TransferSection
        eyebrow="Was Sie heute tun können"
        title="Vorbereitung ist live. Die Ausführung bleibt kontrolliert."
        body="Der aktuelle Stand soll nützlich sein, ohne mehr zu versprechen als tatsächlich bereitsteht."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {nowCards.map((card) => (
            <Reveal key={card.label}>
              <div className="h-full rounded-xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{card.label}</p>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-white">{card.title}</h3>
                <ul className="mt-5 space-y-3">
                  {card.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-white/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/32" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8">
          <TransferIntake />
        </div>
      </TransferSection>

      <TransferSection
        id="hilfe"
        eyebrow="Hilfe und Sicherheit"
        title="Wenn Sie unsicher sind, ist Unterstützung der richtige nächste Schritt."
        body="Der Transferpfad soll nicht technisch einschüchtern. Entscheidend ist, dass Sie keine geheimen Wallet-Daten teilen und offene Fragen früh klären."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Reveal key={faq.question}>
                <details className="group rounded-xl border border-white/10 bg-white/[0.035] p-5">
                  <summary className="cursor-pointer list-none text-base font-semibold tracking-[-0.02em] text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-white/10 bg-[#101827] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Support anfordern</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                Lieber einmal nachfragen als falsch übertragen.
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Schreiben Sie uns mit Ihrer bisherigen Supporter-E-Mail-Adresse. Bitte senden Sie keine Recovery
                Phrase, keinen privaten Schlüssel und kein MetaMask-Passwort.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="mailto:support@unyt.shop?subject=UNYT%20Transfer%20Support&body=Hallo%20UNYT%20Team%2C%0A%0Aich%20benoetige%20Unterstuetzung%20beim%20Transfer.%20Meine%20bisherige%20Supporter-E-Mail-Adresse%20ist%3A%0A%0A"
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#4a9eff] px-4 py-2.5 text-sm font-semibold text-white shadow-none hover:bg-[#6aafff]"
                >
                  Unterstützung anfordern
                </a>
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/45"
                >
                  Transfer ausführen - noch nicht live
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </TransferSection>

      <TransferSection
        eyebrow="Nächste Updates"
        title="Neue Transferstufen werden hier sichtbar, bevor sie aktiv genutzt werden müssen."
        body="Wenn Datenimport, Zuordnungsprüfung oder Transferbestätigung produktionsbereit sind, wird diese Seite zuerst aktualisiert und in der nächsten Supporter-Kommunikation referenziert."
      >
        <div className="rounded-xl border border-white/10 bg-[#101827] p-5 sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Aktueller Betriebsmodus</p>
              <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                Vorbereitung live. Transferausführung kontrolliert in Vorbereitung.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button href="#metamask" variant="brand" className="rounded-lg shadow-none">
                Jetzt vorbereiten
              </Button>
              <Button href="/app/wallet" variant="secondary" className="rounded-lg">
                Wallet-Bereich öffnen
              </Button>
            </div>
          </div>
        </div>
      </TransferSection>
    </>
  );
}
