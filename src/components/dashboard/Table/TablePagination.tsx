import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
/* import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select' */

interface TablePaginationProps {
  itemsPerPage: number
  setItemsPerPage: (value: number) => void // Function that updates the number of items per page
  currentPage: number
  totalPages: number
  filteredItemsTotal: number
  type: string
  handlePageChange: (page: number) => void // Function to handle page changes
}

export default function TablePagination({
  itemsPerPage,
  /*   setItemsPerPage, */
  currentPage,
  totalPages,
  handlePageChange,
  filteredItemsTotal,
  type,
}: TablePaginationProps) {
  /*   const handleItemsPerPageChange = (value: string) => {
    const newValue = parseInt(value, 10)
    if (!isNaN(newValue)) {
      setItemsPerPage(newValue)
    }
  } */
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1
  const lastItemIndex = Math.min(currentPage * itemsPerPage, filteredItemsTotal)
  const itemsBeingDisplayed = Math.min(
    itemsPerPage,
    lastItemIndex - firstItemIndex + 1,
  )

  return (
    <div className="flex w-full flex-row items-center justify-between text-sm text-zinc-500">
      <div className="flex flex-1">
        <span>
          Exibido {itemsBeingDisplayed} de {filteredItemsTotal} {type}
        </span>
      </div>
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-1 items-center gap-2">
          {/*    <span className="flex text-sm text-zinc-500">{type} por página:</span>
          <div className="px-3 py-[6px]">
            <Select
              defaultValue={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="gap-[10px] text-zinc-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        {/* Pagination Component */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                  className="text-black"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
