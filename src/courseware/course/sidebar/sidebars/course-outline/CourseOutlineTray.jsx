import { useState, useEffect, Fragment } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { MenuOpen as MenuOpenIcon } from '@openedx/paragon/icons';

import { useModel } from '@src/generic/model-store';
import { LOADING, LOADED } from '@src/constants';
import PageLoading from '@src/generic/PageLoading';
import {
  getSequenceId,
  getCourseOutline,
  getCourseOutlineStatus,
  getCourseOutlineShouldUpdate,
} from '../../../../data/selectors';
import { getCourseOutlineStructure } from '../../../../data/thunks';
import SidebarSection from './components/SidebarSection';
import SidebarUnit from './components/SidebarUnit';
import { UNIT_ICON_TYPES } from './components/UnitIcon';
import { ID } from './constants';
import { useCourseOutlineSidebar } from './hooks';
import messages from './messages';

const CourseOutlineTray = ({ intl }) => {
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const dispatch = useDispatch();
  const activeSequenceId = useSelector(getSequenceId);
  const { sections = {}, sequences = {}, units = {} } = useSelector(getCourseOutline);
  const courseOutlineStatus = useSelector(getCourseOutlineStatus);
  const courseOutlineShouldUpdate = useSelector(getCourseOutlineShouldUpdate);

  const {
    courseId,
    unitId,
    isEnabledSidebar,
    currentSidebar,
    handleToggleCollapse,
    isActiveEntranceExam,
    shouldDisplayFullScreen,
  } = useCourseOutlineSidebar();

  const {
    sectionId: activeSectionId,
  } = useModel('sequences', activeSequenceId);

  const sectionsIds = Object.keys(sections);

  // Auto-expand the section containing the currently active unit on first load
  useEffect(() => {
    if (activeSectionId && expandedSectionId === null) {
      setExpandedSectionId(activeSectionId);
    }
  }, [activeSectionId]);

  const handleToggleSection = (id) => {
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  const sidebarHeading = (
    <div className="outline-sidebar-heading-wrapper sticky d-flex justify-content-between align-self-start align-items-center bg-light-200 p-2.5 pl-4">
      <span className="outline-sidebar-heading mb-0 h4 text-dark-500">
        {intl.formatMessage(messages.courseOutlineTitle)}
      </span>
      <IconButton
        alt={intl.formatMessage(messages.toggleCourseOutlineTrigger)}
        className="outline-sidebar-toggle-btn flex-shrink-0 text-dark bg-light-200"
        iconAs={MenuOpenIcon}
        onClick={handleToggleCollapse}
      />
    </div>
  );

  useEffect(() => {
    if ((isEnabledSidebar && courseOutlineStatus !== LOADED) || courseOutlineShouldUpdate) {
      dispatch(getCourseOutlineStructure(courseId));
    }
  }, [courseId, isEnabledSidebar, courseOutlineShouldUpdate]);

  if (!isEnabledSidebar || isActiveEntranceExam || currentSidebar !== ID) {
    return null;
  }

  if (courseOutlineStatus === LOADING) {
    return (
      <div className={classNames('outline-sidebar-wrapper', {
        'flex-shrink-0 mr-4 h-auto': !shouldDisplayFullScreen,
        'bg-white m-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
      })}
      >
        <section className="outline-sidebar w-100">
          {sidebarHeading}
          <PageLoading
            srMessage={intl.formatMessage(messages.loading)}
          />
        </section>
      </div>
    );
  }

  return (
    <div className={classNames('outline-sidebar-wrapper', {
      'flex-shrink-0 mr-4 h-auto': !shouldDisplayFullScreen,
      'bg-white m-0 fixed-top w-100 vh-100': shouldDisplayFullScreen,
    })}
    >
      <section className="outline-sidebar w-100">
        {sidebarHeading}
        <ol id="outline-sidebar-outline" className="list-unstyled">
          {sectionsIds.map((sectionId) => {
            const isExpanded = sectionId === expandedSectionId;
            const sequenceIds = sections[sectionId]?.sequenceIds || [];

            return (
              <Fragment key={sectionId}>
                <SidebarSection
                  courseId={courseId}
                  section={sections[sectionId]}
                  isExpanded={isExpanded}
                  handleSelectSection={() => handleToggleSection(sectionId)}
                />
                {isExpanded && (
                  <div className="course-sidebar-section-units border border-top-0 rounded-bottom bg-white mb-2">
                    <ol className="list-unstyled mb-0">
                      {sequenceIds.map((sequenceId) => {
                        const sequence = sequences[sequenceId] || {};
                        const { unitIds = [], type } = sequence;

                        return unitIds.map((unitIdInSeq, index) => (
                          <SidebarUnit
                            key={unitIdInSeq}
                            id={unitIdInSeq}
                            courseId={courseId}
                            sequenceId={sequenceId}
                            unit={units[unitIdInSeq]}
                            isActive={unitId === unitIdInSeq}
                            activeUnitId={unitId}
                            isFirst={index === 0}
                            isLocked={type === UNIT_ICON_TYPES.lock}
                          />
                        ));
                      })}
                    </ol>
                  </div>
                )}
              </Fragment>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

CourseOutlineTray.propTypes = {
  intl: intlShape.isRequired,
};

CourseOutlineTray.ID = ID;

export default injectIntl(CourseOutlineTray);