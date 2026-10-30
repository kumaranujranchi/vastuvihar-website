import './TeamGrid.css';
import './TeamCard.css';
import { getTeamMember } from '@/data/team';
import TeamCard from './TeamCard';
import ScrollingTicker from '@/components/common/ScrollingTicker';

const TEAM_SLUGS = [
  'dennis-daniels',
  'johan-sanford',
  'floyd-miles',
  'leslie-alexander',
  'bernardo-gordon',
  'ralph-edwards',
];

export default function TeamGrid() {
  const members = TEAM_SLUGS.map((slug) => getTeamMember(slug)).filter(Boolean);

  return (
    <div
      className="elementor-element elementor-element-9a02aaf e-flex e-con-boxed e-con e-parent"
      data-id="9a02aaf"
      data-element_type="container"
      data-settings={'{"background_background":"classic"}'}
    >
      <div className="e-con-inner">
        <ScrollingTicker text="meet the team" widgetId="817bdb2" />
        <div
          className="elementor-element elementor-element-b11f5f5 elementor-widget__width-initial animated-fast elementor-invisible elementor-widget elementor-widget-heading"
          data-id="b11f5f5"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="heading.default"
        >
          <div className="elementor-widget-container">
            <h2 className="elementor-heading-title elementor-size-default">
              Global executive leadership{' '}
            </h2>{' '}
          </div>
        </div>
        <div
          className="elementor-element elementor-element-244cde4 animated-fast elementor-invisible elementor-widget elementor-widget-spaciaz-team-box"
          data-id="244cde4"
          data-element_type="widget"
          data-settings={'{"_animation":"opal-move-up"}'}
          data-widget_type="spaciaz-team-box.default"
        >
          <div className="elementor-widget-container">
            <div className="elementor-teambox-item-wrapper">
              <div className="d-grid">
                {members.map((member, i) => (
                  <TeamCard key={member.slug} member={member} priority={i === 0} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
