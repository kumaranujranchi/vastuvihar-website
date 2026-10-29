import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { projects, getProject } from '@/data/projects';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  return project ? {
    title: project.title,
    description: `${project.title} in ${project.location}. Explore project details, features, media and enquiries.`,
  } : { title: 'Project not found' };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageLayout route={`projects/${slug}`}>
      <ProjectDetails project={project} />
    </PageLayout>
  );
}
