import * as React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {
  addPackage,
  setSelectedTagIndex,
} from '../store/packages';

import * as shell from 'shelljs';

import {
  BsPackage,
  BsTag,
  BstPackage,
  RecentCommitData
} from '../interfaces';

class App extends React.Component<any, object> {

  state: any;
  
  constructor(props: any){
    super(props);
    this.state = {
      bsPackages: [],
      value: '',
      selectedTagInfo: 'Pizza is good',
    };
    this.selectTag = this.selectTag.bind(this);
    this.configureButtonClicked = this.configureButtonClicked.bind(this);
  }

  // 1 row per package
  // columns
  //    package name
  //    tag select - displays tag label

  componentDidMount() {

    const bsPackages: BsPackage[] = [];

    const packageBaseDir: string = '/Users/tedshaffer/Documents/Projects/';

    const packageNames: string[] = [];
    packageNames.push('bpfImporter');
    packageNames.push('bsPublisher');

    packageNames.forEach((packageName) => {

      const bsPackage: BstPackage = {};
      (bsPackage as BsPackage).name = packageName;
      (bsPackage as BsPackage).selectedTagIndex = 0;

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

      const bsTags: BsTag[] = [];

      tags.forEach((tag) => {

        // get the commit information for the tag
        // commitLine=$(git show $tag | grep commit)
        const gitShowCmd: string = 'git show ' + tag + ' | grep commit'
        const commitLine: string = shell.exec(gitShowCmd).stdout;
        const commitHash: string = commitLine.split(' ')[1];

        // commitInfo=$(git log -1 $commitHash)
        const gitLogCmd: string = 'git log -1 ' + commitHash;
        const commitInfo: string = shell.exec(gitLogCmd).stdout;

        console.log('BsTag:', tag);
        console.log(commitInfo);
        console.log('');

        bsTags.push( {
          name: tag,
          commit: commitInfo
        });
      });

      (bsPackage as BsPackage).tags = bsTags;
      bsPackages.push(bsPackage as BsPackage);

      this.props.addPackage(bsPackage as BsPackage);

      // get the last n commits on the current branch for this package
      // currentBranch=$(git branch | grep \* | cut -d ' ' -f2)
      let currentBranch: string = '';
      const rawBranches: string = shell.exec('git branch').stdout;
      const branches: string[] = rawBranches.split('\n');
      branches.forEach((branchName) => {
        if (branchName.startsWith('* ')) {
          currentBranch = branchName.substring(2);
        }
      });
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

    this.setState({ bsPackages });
  }

  selectTag(event: any, key: number, payload: any) {
    const params: string[] = payload.split(':');
    this.props.setSelectedTagIndex(params[0], Number(params[1]));
  }

  selectPackageIdType(event: object, value: undefined) {
    console.log('selectedPackageType: ' + value);
  }

  configureButtonClicked() {
    console.log('configureButtonClicked');
  }

  buildTagOption(tag: BsTag, bsPackageName: string, tagIndex: number) {

    return (
      <MenuItem key={tag.name} value={bsPackageName + ':' + tagIndex.toString()} primaryText={tag.name}/>
    );
  }

  buildTagOptions(bsPackage: BsPackage) {

    const tagOptions: any[] = [];

    bsPackage.tags.forEach((tag, index) => {
      const tagOption: any = this.buildTagOption(tag, bsPackage.name, index);
      tagOptions.push(tagOption);
    });

    return tagOptions;
  }

  buildPackageRow(bsPackage: BsPackage) {

    console.log('buildPackageRow: ', bsPackage);

    const tagOptions: any = this.buildTagOptions(bsPackage);

    const self: any = this;

    const tagValue = bsPackage.name + ':' + bsPackage.selectedTagIndex.toString();

    return (
      <TableRow key={bsPackage.name}>
        <TableRowColumn>
          {bsPackage.name}
        </TableRowColumn>
        <TableRowColumn>
          <RadioButtonGroup
            name='packageIdType'
            defaultSelected={bsPackage.name + ':tag'}
            onChange={self.selectPackageIdType}
          >
            <RadioButton
              value={bsPackage.name + ':tag'}
              label='Tag'
            />
            <RadioButton
              value={bsPackage.name + ':branch'}
              label='Branch'
            />
            <RadioButton
              value={bsPackage.name + ':commit'}
              label='Commit'
            />
          </RadioButtonGroup>
        </TableRowColumn>
        <TableRowColumn>
          <SelectField
            floatingLabelText='Tag'
            value={tagValue}
            onChange={self.selectTag}
          >
            {tagOptions}
          </SelectField>
        </TableRowColumn>
        <TableRowColumn>
          master
        </TableRowColumn>
        <TableRowColumn>
          xx69yy
        </TableRowColumn>
      </TableRow>
    );
  }

  buildPackageRows() {

    const bsPackageRows: any = [];

    const bsPackagesByPackageName: any = this.props.bsPackages.bsPackagesByPackageName;
    for (const packageName in bsPackagesByPackageName) {
      if (bsPackagesByPackageName.hasOwnProperty(packageName)) {
        const bsPackage: BsPackage = bsPackagesByPackageName[packageName];
        bsPackageRows.push(this.buildPackageRow(bsPackage));
      }
    }

    return bsPackageRows;
  }

// <TableHeaderColumn>Tag Commit</TableHeaderColumn>
  render() {

    const bsPackageRows: any[] = this.buildPackageRows();

    return (
      <MuiThemeProvider>
        <div>

          <div>Pizza</div>

          <Table>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn>Package name</TableHeaderColumn>
                <TableHeaderColumn>Package Version Selector</TableHeaderColumn>
                <TableHeaderColumn>Tags</TableHeaderColumn>
                <TableHeaderColumn>Branch</TableHeaderColumn>
                <TableHeaderColumn>Commit Hash</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
            >
              {bsPackageRows}
            </TableBody>
          </Table>

          <RaisedButton label='Configure' onClick={this.configureButtonClicked}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state : any) {
  return {
    bsPackages: state.bsPackages,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    addPackage,
    setSelectedTagIndex,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
