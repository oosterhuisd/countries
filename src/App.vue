<template>
  <div>  

    <div class="flex flex-row flex-wrap justify-start items-center gap-x-3 border rounded p-4 mb-5 bg-gray-100 min-w-ful text-sm">
      <div>
        <label>
          <input type="checkbox" class="mr-1" v-model="filters.startsWith" value="1">
            Begint met letter
          </label>
        <select v-if="filters.startsWith" v-model="filterValues.startsWith"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value='' selected>-</option>
          <option v-for="letter in alphabet" :key="letter">
            {{ letter }}
          </option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" class="mr-1" v-model="filters.equalStringLength" value="1">
            Land en hoofdstad met evenveel letters
          </label>
      </div>

      <div>
        <label>
          <input type="checkbox" class="mr-1" v-model="filters.equalStartLetter" value="1">
            Land en hoofdstad beginnen met dezelfde letter
          </label>
      </div>
<!-- 
      <div class="flex items-center justify-self-end">
        <div class="whitespace-nowrap mr-3">Sorteren op:</div>
        <select v-model="filterValues.startsWith"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option></option>
        </select>
      </div> -->
    </div>

    <table class="table-auto min-w-full">
      <caption class="text-right text-gray-400 text-sm">{{ filteredCountries.length }} resultaten</caption>
      <tr class="border-b">
          <ColumnHeader
            v-for="(col, index) of columns"
            :column="col"
            :key="index"
            @sort="sortRows"
            :sort-column="sortColumn"
            :sort-order="sortOrder"
          />
      </tr>
      <tr class="border-b" v-for="country in filteredCountries" :key="country.code">
        <td class="flex items-center p-2">
          <span class="text-4xl pr-4">{{ country.emoji }}</span>
          {{ country.name}}
        </td>
        <td class="p-2">{{ country.capital }}</td>
        <td class="p-2 text-right">{{ country.population?.toLocaleString('nl-NL') }}</td>
        <td class="p-2">{{ country.code }}</td>
        <td class="p-2">{{ country.languages.map((l) => l.name).join(', ') }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import database from './data/countries.json'
import populations from './data/population.json'
import ColumnHeader from './components/ColumnHeader.vue'

import { computed, watch, reactive, ref } from 'vue'

const countries = database.data.countries.map((c) => {
  let p = populations.find((country) => country.country == c.name)
  c.population = p ? Number(p.population) : null;
  return c;
})
const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)); 

let sortedCountries = ref([...countries])

let filteredCountries = computed(() => {
  console.log("Re-rendering list")
  let list = sortedCountries.value
  if (filters.startsWith && filterValues.startsWith != '') {
    list = list.filter((c) => c.name.toLowerCase()[0] == filterValues.startsWith || 
      c.capital != null && c.capital.toLowerCase()[0] == filterValues.startsWith);
  }
  if (filters.equalStringLength) {
    list = list.filter((c) => c.capital != null && c.name.replace(/[^a-z]/i, '').length == c.capital.replace(/[^a-z]/i, '').length)
  }
  if (filters.equalStartLetter) {
    list = list.filter((c) => c.capital != null && c.name[0] == c.capital[0])
  }
  return list;
});

const filters = reactive({
  startsWith: false,
  equalStringLength: false,
  equalStartLetter: false,
  equalEndLetter: false
})
const filterValues = reactive({
  startsWith: ''
})

const columns = [
  { name: 'country', label: 'Land' },
  { name: 'capital', label: 'Hoofdstad' },
  { name: 'population', label: 'Inwoners', type: Number },
  { name: 'code', label: 'Landcode' },
  { name: 'languages', label: 'Talen', sortable: false },
];

// Sorteren
let sortColumn = ref(columns[0]?.name);
let sortOrder = ref('asc');
const sortRows = (column: string, order: string='asc') => {
    console.log("Ordering by ", column, order)
    let [c, d] = order == 'asc' ? [1,-1] : [-1,1];    
    sortedCountries.value.sort((a, b) => a[column] > b[column] ? c : d);
    sortOrder.value = order;
    sortColumn.value = column;
}


</script>