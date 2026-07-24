import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as farCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import messages from './messages';

const UnitLink = ({
  id,
  intl,
  courseId,
  sequenceId,
  first,
  unit,
}) => {
  const {
    complete,
    title,
  } = unit;

  return (
    <li>
      <div className={classNames('', { 'mt-2 pt-2 border-top border-light': !first })}>
        <div className="row w-100 m-0">
          <div className="col-auto p-0">
            {complete ? (
              <FontAwesomeIcon
                icon={fasCheckCircle}
                fixedWidth
                className="float-left text-success mt-1"
                aria-hidden={complete}
                title={intl.formatMessage(messages.completedAssignment)}
              />
            ) : (
              <FontAwesomeIcon
                icon={farCheckCircle}
                fixedWidth
                className="float-left text-gray-400 mt-1"
                aria-hidden={complete}
                title={intl.formatMessage(messages.incompleteAssignment)}
              />
            )}
          </div>
          <div className="col-10 p-0 ml-3 text-break">
            <span className="align-middle">
              <Link to={`/course/${courseId}/${sequenceId}/${id}`}>{title}</Link>
            </span>
            <span className="sr-only">
              , {intl.formatMessage(complete ? messages.completedAssignment : messages.incompleteAssignment)}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

UnitLink.propTypes = {
  id: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  first: PropTypes.bool.isRequired,
  unit: PropTypes.shape().isRequired,
};

export default injectIntl(UnitLink);