import React from 'react';
import { isDevBuild } from '../src/config/build-env';
import { NextPage } from 'next';
import { DefaultMeta } from '../src/components/meta/default-meta';

const IndexPage: NextPage = (props) => {
  return (
    <div>
      <DefaultMeta title="TITLE" />
      <h1>vox.ts demo</h1>
      <ul>
        <li>
          <a className="underscore" href="/demo-models">
            demo models
          </a>
          <a className="underscore" href="/babylon/demo">
            model
          </a>
        </li>
      </ul>
    </div>
  );
};

export default IndexPage;
