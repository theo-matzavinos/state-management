import type { Signal } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  numberAttribute,
} from '@angular/core';
import { HlmPaginationImports } from '@spartan-ng/ui-pagination-helm';

@Component({
  selector: 'slg-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[hidden]': 'pagesCount() <= 1',
  },
  imports: [HlmPaginationImports],
  template: `
    @if (pagesCount() > 1) {
      <nav hlmPagination class="m-0 flex justify-between">
        <div class="flex items-center gap-2">
          <div id="page-size-label">Items per page:</div>
          <ul hlmPaginationContent aria-labelledby="page-size-label">
            <li hlmPaginationItem>
              <a
                hlmPaginationLink
                link="."
                [queryParams]="{ page: 0, pageSize: 10 }"
                queryParamsHandling="merge"
                [isActive]="pageSize() === 10"
                >10</a
              >
            </li>
            <li hlmPaginationItem>
              <a
                hlmPaginationLink
                link="."
                [queryParams]="{ page: 0, pageSize: 20 }"
                queryParamsHandling="merge"
                [isActive]="pageSize() === 20"
                >20</a
              >
            </li>
            <li hlmPaginationItem>
              <a
                hlmPaginationLink
                link="."
                [queryParams]="{ page: 0, pageSize: 50 }"
                queryParamsHandling="merge"
                [isActive]="pageSize() === 50"
                >50</a
              >
            </li>
          </ul>
        </div>

        <ul hlmPaginationContent aria-label="Page navigation">
          <li hlmPaginationItem>
            <hlm-pagination-previous
              link="."
              [queryParams]="{ page: previousPage() }"
              queryParamsHandling="merge"
            />
          </li>

          <li hlmPaginationItem>
            <a
              hlmPaginationLink
              link="."
              [queryParams]="{ page: 0 }"
              queryParamsHandling="merge"
              [isActive]="page() === 0"
              >1</a
            >
          </li>

          @if (firstDisplayedPage() > 2) {
            <li hlmPaginationItem>
              <hlm-pagination-ellipsis />
            </li>
          }

          @for (displayedPage of displayedPages(); track displayedPage) {
            <li hlmPaginationItem>
              <a
                hlmPaginationLink
                link="."
                [queryParams]="{ page: displayedPage }"
                queryParamsHandling="merge"
                [isActive]="page() === displayedPage"
                >{{ displayedPage + 1 }}</a
              >
            </li>
          }

          @if (pagesCount() - lastDisplayedPage() > 2) {
            <li hlmPaginationItem>
              <hlm-pagination-ellipsis />
            </li>
          }

          <li hlmPaginationItem>
            <a
              hlmPaginationLink
              link="."
              [queryParams]="{ page: pagesCount() - 1 }"
              queryParamsHandling="merge"
              [isActive]="page() === pagesCount() - 1"
              >{{ pagesCount() }}</a
            >
          </li>

          <li hlmPaginationItem>
            <hlm-pagination-next
              link="."
              [queryParams]="{ page: nextPage() }"
              queryParamsHandling="merge"
            />
          </li>
        </ul>
      </nav>
    }
  `,
})
export class Pagination {
  page = input.required({ transform: numberAttribute });
  pageSize = input.required({ transform: numberAttribute });
  count = input.required({ transform: numberAttribute });
  pagesCount = computed(() => Math.ceil(this.count() / this.pageSize()));
  displayedPages = computed(() =>
    computedDisplayedPages(this.page, this.pagesCount),
  );
  firstDisplayedPage = () => this.displayedPages().at(1) ?? 0;
  lastDisplayedPage = () => this.displayedPages().at(-1) ?? 0;
  previousPage = () => Math.max(this.page() - 1, 0);
  nextPage = () => Math.min(this.page() + 1, this.pagesCount() - 1);
}

function computedDisplayedPages(
  page: Signal<number>,
  pagesCount: Signal<number>,
) {
  if (pagesCount() < 6) {
    return Array.from({ length: pagesCount() - 2 }, (_, i) => i + 1);
  }

  if (page() < Math.round(pagesCount() / 2)) {
    const firstPage = Math.max(page() - 1, 1);

    return padDisplayedPages(pagesCount(), [
      firstPage,
      firstPage + 1,
      firstPage + 2,
    ]);
  }

  const lastPage = Math.min(page() + 1, pagesCount() - 2);

  return padDisplayedPages(pagesCount(), [
    lastPage - 2,
    lastPage - 1,
    lastPage,
  ]);
}

function padDisplayedPages(pagesCount: number, displayedPages: number[]) {
  return padEnd(pagesCount, padStart(displayedPages));
}

function padStart(displayedPages: number[]) {
  const firstPage = displayedPages[0];

  if (firstPage === 2) {
    displayedPages.unshift(1);
  }

  return displayedPages;
}

function padEnd(pagesCount: number, displayedPages: number[]) {
  const lastPage = displayedPages.at(-1)!;

  if (pagesCount - lastPage === 3) {
    displayedPages.push(pagesCount - 2);
  }

  return displayedPages;
}
