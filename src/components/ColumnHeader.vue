<template>
  <th scope="col" class="text-sm font-medium text-gray-900 p-2 dark:bg-dark-eval-1 dark:text-white"
  >
    <div class="flex"
        :class="{ 'cursor-pointer': column.sortable != false, 'justify-end': column.type && column.type == 'numeric'}"
        @click.stop="changeSortOrder"
    >
      {{ column.label ?? column.name }}
      <span v-if="sortStatus == 'asc'">
        <ChevronDownIcon size="1.5x" class="text-gray-300 flex-shrink-0 w-4 h-4 ml-2" />
      </span>
      <span v-else-if="sortStatus == 'desc'">
        <ChevronUpIcon class="text-gray-300 flex-shrink-0 w-4 h-4 ml-2" />
      </span>
      <span v-else-if="column.sortable != false">
        <SelectorIcon class="text-gray-300 flex-shrink-0 w-5 h-5 ml-2" />
      </span>
    </div>
  </th>
</template>
<script setup lang="ts">
import { SelectorIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/outline'
import { ref, computed } from 'vue'

const props = defineProps<{
  column: any,
  sortColumn?: string,
  sortOrder?: string
}>()
const emit = defineEmits<{
  (e: 'sort', column: string, order?: string): void
}>()

const sortStatus = computed(() => (props.column?.name == props.sortColumn ? props.sortOrder : null))
function changeSortOrder() {
    if (sortStatus.value == 'asc') {
        emit('sort', props.column.name, 'desc');
    } else if (sortStatus.value == 'desc' || props.column.sortable != false) {
        emit('sort', props.column.name);
    }
}

</script>