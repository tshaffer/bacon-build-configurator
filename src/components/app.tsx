import * as React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import * as shell from 'shelljs';

import { RecentCommitData } from '../interfaces';

export default class App extends React.Component<any, object> {

  componentDidMount() {

    const packageBaseDir: string = '/Users/tedshaffer/Documents/Projects/';

    const packageNames: string[] = [];
    packageNames.push('bpfImporter');
    packageNames.push('bsPublisher');

    packageNames.forEach((packageName) => {

      const packagePath = packageBaseDir.concat(packageName);

      console.log('packageName: ', packageName);
      console.log('packagePath: ', packagePath);

      shell.cd(packagePath);
      shell.pwd();

      // Get tags for this package
      // tags=$(git tag)
      const rawTags: any = shell.exec('git tag');

      const splitTags: string[] = rawTags.split('\n');

      const tags: string[] = [];
      splitTags.forEach((tag) => {
        if (tag !== '') {
          tags.push(tag);
        }
      });

      tags.forEach((tag) => {

        // get the commit information for the tag
        // commitLine=$(git show $tag | grep commit)
        const gitShowCmd: string = 'git show ' + tag + ' | grep commit'
        const commitLine: string = shell.exec(gitShowCmd).stdout;
        const commitHash: string = commitLine.split(' ')[1];

        // commitInfo=$(git log -1 $commitHash)
        const gitLogCmd: string = 'git log -1 ' + commitHash;
        const commitInfo: string = shell.exec(gitLogCmd).stdout;

        console.log('Tag:', tag);
        console.log(commitInfo);
        console.log('');
      });

      // get the last n commits on the current branch for this package
      // currentBranch=$(git branch | grep \* | cut -d ' ' -f2)
      let currentBranch: string = '';
      const rawBranches: string = shell.exec('git branch').stdout;
      const branches: string[] = rawBranches.split('\n');
      branches.forEach((branchName) => {
        if (branchName.startsWith('* ')) {
          currentBranch = branchName.substring(2);
        }
      })
      console.log('currentBranch: ', currentBranch);

      // git log -$numCommits
      const numRecentCommits = 3;
      const recentCommits: RecentCommitData[] = [];
      for (let i = 0; i < (numRecentCommits - 1); i++) {
        const commitMessage = shell.exec('git log -1 --skip=' + i.toString()).stdout;
        const commitHash = commitMessage.substr(7, 40);
        recentCommits.push( {
          commitHash,
          commitMessage
        });
      }

      console.log('Recent commit messages:');
      console.log(recentCommits);
      console.log('');
    });
  }

  buttonClicked() {
    console.log('buttonClicked');
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <div>Pizza</div>
          <RaisedButton label='Delete' onClick={this.buttonClicked.bind(this)}/>
        </div>
      </MuiThemeProvider>
    );
  }
}
