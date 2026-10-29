import { notFound } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import TeamMember from '@/components/team/TeamMember';
import { teamMembers, getTeamMember } from '@/data/team';

export const dynamicParams = false;

export function generateStaticParams() {
  return teamMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return { title: 'Team member not found' };
  return {
    title: member.name,
    description: `${member.name} — ${member.role}. Meet the Spaciaz team.`,
  };
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();
  return (
    <PageLayout route={`our-team/${member.slug}`}>
      <TeamMember member={member} />
    </PageLayout>
  );
}
