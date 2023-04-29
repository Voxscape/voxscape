import React from 'react';
import { isDevBuild } from '../src/config/build-env';
import { NextPage } from 'next';
import { DefaultMeta } from '../src/components/meta/default-meta';

const IndexPage: NextPage = (props) => {
  return (
    <div>
      <DefaultMeta title="TITLE" />
      <h1>vox.ts demo</h1>
      <ul className="space-x-2">
        <li>
          <a className="underscore" href="/demo-models">
            demo models
          </a>
        </li>
        <li>
          <a className="underscore" href="/demo/babylon">
            babylonjs demo
          </a>
        </li>
      </ul>
    </div>
  );
};

export default IndexPage;
