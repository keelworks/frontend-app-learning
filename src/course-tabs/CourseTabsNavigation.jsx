import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';
import { CoursewareSearch, CoursewareSearchToggle } from '../course-home/courseware-search';
import { useCoursewareSearchState } from '../course-home/courseware-search/hooks';

// Publishes the Global Nav's height as --learning-header-height so the sticky
// course tabs sit directly below it, even when the header resizes.
const useLearningHeaderHeight = () => {
  useEffect(() => {
    const header = document.querySelector('.learning-header');
    if (!header || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty('--learning-header-height', `${header.offsetHeight}px`);
    });
    observer.observe(header);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--learning-header-height');
    };
  }, []);
};

const CourseTabsNavigation = ({
  activeTabSlug, className, tabs, intl,
}) => {
  const { show } = useCoursewareSearchState();
  useLearningHeaderHeight();

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className="nav-underline-tabs"
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {tabs.map(({ url, title, slug }) => (
                <a
                  key={slug}
                  className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
                  aria-current={slug === activeTabSlug ? 'page' : undefined}
                  href={url}
                >
                  {title}
                </a>
              ))}
            </Tabs>
          </div>
          <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
