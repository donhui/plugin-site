import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {Modal, ModalHeader, ModalBody} from 'reactstrap';

function PluginDependencies({dependencies, reverseDependencies} ) {
    const [isShowImplied, setShowImplied] = React.useState(false);
    const toggleShowImplied = (e) => {
        e && e.preventDefault();
        setShowImplied(!isShowImplied);
    };

    const dependencyLink = (dependency) => {
        return (
            <div key={dependency.name} className="implied">
                <Link to={`/${dependency.name}/`}>
                    {dependency.title}
                    {' ≥ '}
                    {dependency.version}
                </Link>
            </div>
        );
    };
    const reverseDependencyLink = (dependency) => {
        return (
            <div key={dependency.dependentName}>
                <Link to={`/${dependency.dependentName}/`}>
                    {dependency.dependentTitle}
                </Link>
            </div>
        );
    };
    const splitByType = (dependencies, linkFormat) => {
        const optionalDependencies = dependencies.filter(dep => dep.optional);
        const impliedDependencies = dependencies.filter(dep => dep.implied && !dep.optional);
        const requiredDependencies = dependencies.filter(dep => !dep.implied && !dep.optional);
        return (<div>
            {
                !(optionalDependencies.length + impliedDependencies.length) ? '' : (
                    <h3>Required</h3>
                )
            }
            {
                requiredDependencies.map(linkFormat)
            }
            {
                !optionalDependencies.length ? '' : (
                    <h3>Optional</h3>
                )
            }
            {
                optionalDependencies.map(linkFormat)
            }
            {
                !impliedDependencies.length ? '' : (
                    <h3>
                        Implied
                        {' '}
                        <a href="#" onClick={toggleShowImplied}><span className="req">(what&apos;s this?)</span></a>
                    </h3>
                )
            }
            {
                impliedDependencies.map(linkFormat)
            }
        </div>);
    };
    return (
        <div className="content pb-3" id="pluginDependencies">
            <h2>Dependencies</h2>
            <Modal placement="bottom" isOpen={isShowImplied} target="pluginDependencies" toggle={toggleShowImplied}>
                <ModalHeader toggle={toggleShowImplied}>About Implied Plugin Dependencies</ModalHeader >
                <ModalBody>
                    <div>
                        <p>
                            Features are sometimes detached (or split off) from Jenkins core and moved into a plugin.
                            Many plugins, like Subversion or JUnit, started as features of Jenkins core.
                        </p>
                        <p>
                            Plugins that depend on a Jenkins core version before such a plugin was detached from core may or may not actually use any of its features.
                            To ensure that plugins don&apos;t break whenever functionality they depend on is detached from Jenkins core, it is considered to have a dependency on the detached plugin if it declares a dependency on a version of Jenkins core before the split.
                            Since that dependency to the detached plugin is not explicitly specified, it is
                            {' '}
                            <em>implied</em>
                            .
                        </p>
                        <p>
                            Plugins that don&apos;t regularly update which Jenkins core version they depend on will accumulate implied dependencies over time.
                        </p>
                    </div>
                </ModalBody>
            </Modal>
            {
                dependencies.length ? splitByType(dependencies, dependencyLink)
                    : (<div className="empty">No dependencies found</div>)
            }
            <h2>Dependent plugins</h2>
            {
                reverseDependencies.length ? splitByType(reverseDependencies, reverseDependencyLink)
                    : (<div className="empty">No dependent plugins found</div>)
            }
        </div>
    );
}

PluginDependencies.propTypes = {
    dependencies: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            version: PropTypes.string.isRequired,
            optional: PropTypes.bool,
            implied: PropTypes.bool
        })
    ),
    reverseDependencies: PropTypes.arrayOf(
        PropTypes.shape({
            dependentName: PropTypes.string.isRequired,
            dependentTitle: PropTypes.string.isRequired,
            optional: PropTypes.bool,
            implied: PropTypes.bool,
        })
    )
};

export default PluginDependencies;
