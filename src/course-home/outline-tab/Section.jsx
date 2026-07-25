import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Collapsible, IconButton, Icon } from '@openedx/paragon';
import { faCheckCircle as fasCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DisabledVisible } from '@openedx/paragon/icons';
import UnitLink from './UnitLink';

import genericMessages from '../../generic/messages';
import messages from './messages';

const Section = ({
  courseId,
  defaultOpen,
  expand,
  intl,
  section,
  sequences,
  units,
}) => {
  const {
    complete,
    sequenceIds,
    title,
    hideFromTOC,
  } = section;

  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(expand);
  }, [expand]);

  useEffect(() => {
    setOpen(defaultOpen);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sectionTitle = (
    <div className="d-flex row w-100 m-0">
      <div className="col-auto p-0">
        {complete ? (
          <FontAwesomeIcon
            icon={fasCheckCircle}
            fixedWidth
            className="float-left mt-1 text-success"
            aria-hidden="true"
            title={intl.formatMessage(messages.completedSection)}
          />
        ) : (
          <FontAwesomeIcon
            icon={farCheckCircle}
            fixedWidth
            className="float-left mt-1 text-gray-400"
            aria-hidden="true"
            title={intl.formatMessage(messages.incompleteSection)}
          />
        )}
      </div>
      <div className="col-7 ml-3 p-0 font-weight-bold text-dark-500">
        <span className="align-middle col-6">{title}</span>
        <span className="sr-only">
          , {intl.formatMessage(complete ? messages.completedSection : messages.incompleteSection)}
        </span>
      </div>
      {hideFromTOC && (
      <div className="row">
        {hideFromTOC && (
          <span className="small d-flex align-content-end">
            <Icon className="mr-2" src={DisabledVisible} data-testid="hide-from-toc-section-icon" />
            <span data-testid="hide-from-toc-section-text">
              {intl.formatMessage(messages.hiddenSection)}
            </span>
          </span>
        )}
      </div>
      )}
    </div>
  );

  return (
    <li>
      <Collapsible
        className="mb-2"
        styling="card-lg"
        title={sectionTitle}
        open={open}
        onToggle={() => { setOpen(!open); }}
        iconWhenClosed={(
          <IconButton
            alt={intl.formatMessage(messages.openSection)}
            icon={faPlus}
            onClick={() => { setOpen(true); }}
            size="sm"
          />
        )}
        iconWhenOpen={(
          <IconButton
            alt={intl.formatMessage(genericMessages.close)}
            icon={faMinus}
            onClick={() => { setOpen(false); }}
            size="sm"
          />
        )}
      >
        <ol className="list-unstyled pl-5">
          {sequenceIds.map((sequenceId) => {
            const sequence = sequences[sequenceId] || {};
            const { unitIds = [] } = sequence;

            return unitIds.map((unitId, index) => (
              <UnitLink
                key={unitId}
                id={unitId}
                courseId={courseId}
                sequenceId={sequenceId}
                unit={units[unitId] || {}}
                first={index === 0 && sequenceId === sequenceIds[0]}
              />
            ));
          })}
        </ol>
      </Collapsible>
    </li>
  );
};

Section.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  expand: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
  section: PropTypes.shape().isRequired,
  sequences: PropTypes.objectOf(PropTypes.shape()),
  units: PropTypes.objectOf(PropTypes.shape()),
};

Section.defaultProps = {
  sequences: {},
  units: {},
};

export default injectIntl(Section);