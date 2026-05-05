import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Container,
  DisplayHeading,
  Eyebrow,
  Masthead,
} from "@/components/ui";
import { VaultGate } from "@/components/vault-gate";
import { getProject, projects } from "@/lib/projects";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.client} — Daniel Lewis`,
    description: project.about,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <VaultGate>
      <article className="relative flex flex-col">
        <Container className="pt-24 md:pt-32 pb-12 md:pb-16">
          <Masthead
            animate={false}
            left={`INDEX 001.02 / WORK / ${project.index}`}
            right={
              <Link href="/work" className="hover:text-fg transition-colors">
                ← (Back) All Work
              </Link>
            }
          />

          <DisplayHeading size="lg" className="uppercase">
            {project.client}.
          </DisplayHeading>

          {/* Subtitle / project headline in mono */}
          <p className="mt-6 md:mt-8 font-mono text-[11px] md:text-[13px] uppercase text-fg/85 leading-[1.5] max-w-2xl">
            <span className="text-fg/45 mr-2">(TITLE)</span>
            {project.title}
          </p>

          {/* Spec sheet — Status / Year / Category / Role */}
          <dl className="grid grid-cols-12 gap-4 mt-12 md:mt-16 border-t pt-6">
            <SpecField
              label="(Status)"
              value={`${project.status}, ${project.year}`}
            />
            <SpecField label="(Category)" value={project.category} />
            <SpecField label="(Role)" value={project.role} />
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <Eyebrow tone="muted" as="div" className="mb-2">
                (About)
              </Eyebrow>
              <dd className="font-mono text-[11px] md:text-[13px] uppercase text-fg/85 leading-[1.6]">
                {project.about}
              </dd>
            </div>
          </dl>
        </Container>

        {/* Full-bleed cover block — mono inversion until imagery is added */}
        <div className="aspect-[16/9] md:aspect-[21/9] flex items-end p-8 md:p-12 overflow-hidden bg-fg text-bg">
          <span className="font-mono text-[11px] uppercase opacity-70">
            (Cover · Placeholder) {project.client}
          </span>
        </div>

        {/* Body */}
        {project.body && project.body.length > 0 && (
          <Container className="py-20 md:py-28">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7 md:col-start-3 flex flex-col gap-6 font-mono text-[12px] md:text-[14px] uppercase leading-[1.7] text-fg/85">
                {project.body.map((p, i) => (
                  <p key={i}>
                    <span className="text-fg/45 mr-2">
                      ({String(i + 1).padStart(2, "0")})
                    </span>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Container>
        )}

        {/* Next project — full bleed accent */}
        <Link
          href={`/work/${next.slug}`}
          className="group block bg-accent text-accent-fg overflow-hidden border-t"
        >
          <Container className="py-6 md:py-8 grid grid-cols-12 gap-4 items-baseline">
            <div className="col-span-6 font-mono text-[11px] uppercase opacity-70">
              (Next / {next.index})
            </div>
            <div className="col-span-6 text-right font-mono text-[11px] uppercase opacity-70 transition-transform group-hover:translate-x-1">
              Continue →
            </div>
            <DisplayHeading
              as="div"
              size="sm"
              className="col-span-12 mt-2 leading-[0.9] uppercase whitespace-nowrap"
            >
              {next.client}.
            </DisplayHeading>
          </Container>
        </Link>
      </article>
    </VaultGate>
  );
}

function SpecField({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-6 md:col-span-2">
      <Eyebrow tone="muted" as="div" className="mb-2">
        {label}
      </Eyebrow>
      <dd className="font-mono text-[11px] md:text-[13px] uppercase text-fg/90">
        {value}
      </dd>
    </div>
  );
}
