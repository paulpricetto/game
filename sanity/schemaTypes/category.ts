import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty (optional)',
      type: 'string',
      options: { list: ['easy', 'medium', 'hard'] },
    }),
    defineField({
      name: 'products',
      title: 'Products (4 per category)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.required().length(4),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
})


