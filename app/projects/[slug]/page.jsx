import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { projects, getProject } from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };

  return createPageMetadata({
    title: project.title,
    description: `${project.title} by Vastu Vihar. Explore model specifications, floor plans, photos, pricing and township amenities.`,
    path: `/projects/${slug}/`,
    ...(project.image ? { image: project.image } : {}),
  });
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageLayout route={`projects/${slug}`}>
      <ProjectDetails project={project} />
      <BreadcrumbJsonLd items={[{ name: 'Home Models', path: '/projects/' }, { name: project.title }]} />
    </PageLayout>
  );
}
