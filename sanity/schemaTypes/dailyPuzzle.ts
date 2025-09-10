import { defineField, defineType } from 'sanity'

export const dailyPuzzle = defineType({
  name: 'dailyPuzzle',
  title: 'Daily Puzzle',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Puzzle Date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'groups',
      title: 'Groups',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule) => Rule.required().length(4),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'date' },
    prepare({ title }) {
      return { title: `Daily Puzzle: ${title}` }
    },
  },
})


