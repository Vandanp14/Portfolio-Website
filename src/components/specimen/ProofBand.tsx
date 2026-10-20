import banner from '../../assets/fanatics-banner.jpg?w=828;1440;2000&format=avif;webp;jpg&as=picture';
import { fanaticsHighlight } from '../../content/portfolio';
import { Eyebrow, Picture, SectionHead, Shell, TextLink } from './primitives';

const NODES = [
  { name: 'Slack', code: 'where the team already asks' },
  { name: 'Internal router', code: 'message → tool call' },
  { name: 'Bedrock AgentCore', code: 'Elixir · SigV4 · IMDSv2' },
  { name: 'Phoenix API', code: 'read-only, compile-time' },
];

export function ProofBand() {
  return (
    <section className="band band-runtime section">
      <Shell>
        <SectionHead
          index="02 — Proof"
          title={
            <>
              Eight weeks inside a <em>distributed</em> product system.
            </>
          }
          note="Product Builder configures every trading-card product Fanatics manufactures. It had no API and no AI surface when I joined."
        />

        <div className="proof__lead" style={{ marginTop: 'clamp(40px, 5vw, 72px)' }}>
          <div className="proof__statement">
            <Eyebrow>{fanaticsHighlight.eyebrow}</Eyebrow>
            <p className="display-sm" style={{ marginTop: 16, maxWidth: '16ch' }}>
              First API.
              <br />
              First agent.
              <br />
              <em>Zero mutations.</em>
            </p>
          </div>
          <p className="body proof__note">
            Five read-only REST endpoints with dynamic OpenAPI 3.0, then an AI Copilot that routes
            Slack questions through Bedrock AgentCore to the Phoenix backend. A compile-time
            read-only repository means any write fails at build, not at runtime.
          </p>
        </div>

        <div className="proof__figures">
          {fanaticsHighlight.metrics.map((metric) => (
            <div className="proof__figure" key={metric.label}>
              <b>{metric.value}</b>
              <span>
                {metric.label}
                <br />
                {metric.detail}
              </span>
            </div>
          ))}
        </div>

        <figure style={{ marginTop: 'clamp(40px, 5vw, 72px)' }}>
          <div className="stage">
            <div className="stage__frame" style={{ aspectRatio: '16 / 9' }}>
              <Picture
                image={banner}
                sizes="(max-width: 900px) 100vw, 1200px"
                alt={fanaticsHighlight.imageAlt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 38%' }}
              />
            </div>
            <figcaption className="stage__caption">
              <span className="mono">New York, Summer 2026</span>
              <span className="mono" aria-hidden="true">
                Fig. 04
              </span>
            </figcaption>
          </div>
        </figure>

        <div className="diagram" role="list" aria-label="How the copilot answers a question">
          {NODES.map((node, i) => (
            <div className="diagram__node" role="listitem" key={node.name}>
              <code>{String(i + 1).padStart(2, '0')}</code>
              <b>{node.name}</b>
              <code>{node.code}</code>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32 }}>
          <TextLink to="/experience">The full engineering record</TextLink>
        </p>
      </Shell>
    </section>
  );
}
