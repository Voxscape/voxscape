import React from 'react';
import { isDevBuild } from '../src/config/build-env';
import { NextPage } from 'next';
import { DefaultMeta } from '../src/demo/components/default-meta';

const IndexPage: NextPage = (props) => {
  return (
    <div>
      <DefaultMeta />
      <h1>vox.ts demo</h1>
      <ul>
        <li>
          <a className="underscore" href="/demo/babylon">
            Babylon.js
          </a>
        </li>
      </ul>
    </div>
  );
};

export default IndexPage;
