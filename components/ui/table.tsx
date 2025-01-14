import * as React from "react"

const Table = React.forwardRef
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className="w-full caption-bottom text-sm"
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className="h-12 px-4 text-left align-middle font-medium"
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className="p-4 align-middle"
    {...props}
  />
))
TableCell.displayName = "TableCell"

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
}