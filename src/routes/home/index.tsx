import { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { axios } from '@utils';
import Icon from '@components/icon';
import { MAIN_CONTENT_CLASSNAME } from '@consts';
import styles from './index.module.scss';

interface ProjectShape {
  name: string;
  code: string;
  id: string;
}

interface ProjectProps {
  data: ProjectShape;
  isActive: boolean;
  onChange(id: string): void;
}

const Project = (props: ProjectProps) => {
  const { data, isActive, onChange } = props;
  const handleClickProjectName = useCallback(() => {
    onChange(data.id);
  }, [onChange, data.id]);

  return (
    <div className={classnames(styles.project, { [styles.active]: isActive })}>
      <div className={styles.name} onClick={handleClickProjectName}>
        {data.name}
      </div>
      <div className={styles.icons}>
        <Icon type="bianji" className={styles.icon}></Icon>
        <Icon type="shanchu" className={styles.icon}></Icon>
      </div>
    </div>
  );
};

export default function Home() {
  const [projects, setProjects] = useState<ProjectShape[]>([]);
  const [activeProjectId, setActiveProjectId] = useState('');

  useEffect(() => {
    axios.get<ProjectShape[]>('/enc-oss-easydock/api/builder/v1/project/list/all').then(({ data }) => {
      setProjects(data);

      if (data.length) {
        setActiveProjectId(data[0].id);
      }
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={classnames(MAIN_CONTENT_CLASSNAME, styles.header)}>
        <div className={styles['project-list']}>
          {projects.map((project) => {
            return (
              <Project
                onChange={setActiveProjectId}
                data={project}
                isActive={activeProjectId === project.id}
                key={project.id}
              ></Project>
            );
          })}
        </div>
      </div>
    </div>
  );
}
