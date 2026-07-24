import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Icon } from '@openedx/paragon';
import { ChevronRight as ChevronRightIcon, ExpandMore as ChevronDownIcon } from '@openedx/paragon/icons';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { getSequenceId } from '@src/courseware/data/selectors';
import CompletionIcon from './CompletionIcon';

const SidebarSection = ({
  intl, section, isExpanded, handleSelectSection,
}) => {
  const {
    id,
    complete,
    title,
    sequenceIds,
    completionStat,
  } = section;

  const activeSequenceId = useSelector(getSequenceId);
  const isActiveSection = sequenceIds.includes(activeSequenceId);

  const sectionTitle = (
    <>
      <div className="col-auto p-0">
        <CompletionIcon completionStat={completionStat} />
      </div>
      <div className="col-10 ml-3 p-0 flex-grow-1 text-dark-500 text-left text-break">
        {title}
        <span className="sr-only">
          , {intl.formatMessage(complete
          ? courseOutlineMessages.completedSection
          : courseOutlineMessages.incompleteSection)}
        </span>
      </div>
    </>
  );

  return (
    <li className="course-sidebar-section">
      <Button
        variant="tertiary"
        aria-expanded={isExpanded}
        className={classNames(
          'd-flex align-items-center w-100 px-4 py-3.5 rounded-0 justify-content-start',
          { 'bg-info-100': isActiveSection },
        )}
        onClick={() => handleSelectSection(id)}
      >
        {sectionTitle}
        <Icon src={isExpanded ? ChevronDownIcon : ChevronRightIcon} />
      </Button>
    </li>
  );
};

SidebarSection.propTypes = {
  intl: intlShape.isRequired,
  section: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    sequenceIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  isExpanded: PropTypes.bool,
  handleSelectSection: PropTypes.func.isRequired,
};

SidebarSection.defaultProps = {
  isExpanded: false,
};

export default injectIntl(SidebarSection);