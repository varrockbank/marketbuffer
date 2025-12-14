import { ViewLayout } from '../ViewLayout.js';
import { ProjectSelector } from '../ProjectSelector.js';
import { FileTreeContainer } from '../FileTree.js';

export const CodeView = {
  components: { ViewLayout, ProjectSelector, FileTreeContainer },
  template: `
    <ViewLayout>
      <template #header>
        <ProjectSelector />
      </template>
      <template #menu>
        <FileTreeContainer />
      </template>
      <div class="view-content-inner">
        <h1 class="view-content-title">Code</h1>
        <p class="view-content-text">Select a file from the tree to view its contents.</p>
      </div>
    </ViewLayout>
  `,
};
