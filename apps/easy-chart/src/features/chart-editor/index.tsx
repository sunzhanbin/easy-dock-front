import { memo } from 'react';
import { Switch, Route, useRouteMatch, useParams } from 'react-router-dom';
import EditorHeader from '../editor-header';
import ChartDesign from '../chart-design';
import styles from './index.module.scss';

function ChartEditor() {
    const match = useRouteMatch();
    
    return (
        <div className={styles.container}>
            <EditorHeader></EditorHeader>
            <div className={styles['chart-editor-content']}>
                <Switch>
                    <Route path={`${match.path}/chart-design`} component={ChartDesign} />
                </Switch>
            </div>
        </div>
    );
}

export default memo(ChartEditor);
