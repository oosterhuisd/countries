<template>
  <div>  
    <div class="flex flex-row flex-wrap justify-start items-center gap-x-3 border rounded p-4 mb-5 bg-gray-100 text-sm">
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
      <caption class="text-right text-gray-400 text-sm">{{ sortedCountries.length }} resultaten</caption>
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
      <tr class="border-b" v-for="country in sortedCountries" :key="country.code">
        <td class="flex items-center p-2">
          <span class="text-4xl pr-4">{{ country.emoji }}</span>
          {{ country.name}}
        </td>
        <td class="p-2">{{ country.capital }}</td>
        <td class="p-2 text-right">{{ country.population?.toLocaleString('nl-NL') }}</td>
        <td class="p-2">{{ country.code }}</td>
        <td class="p-2">{{ country.languages.map((l) => l.name).join(', ') }}</td>
        <td class="p-2">
          <span class="text-xs font-semibold inline-block py-1 px-2 rounded-full uppercase last:mr-0 mr-1" 
          v-for="(c, i) in country.currency?.split(',')" :key="i"
          :class="tagColor(c)"
          >
            {{ c }}  
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import database from './data/countries.json'
import populations from './data/population.json'
import ColumnHeader from './components/ColumnHeader.vue'

import { computed, watch, reactive, ref } from 'vue'

const countries = database.data.countries
// .map((c) => {
//   let p = populations.find((country) => country.country == c.name)
//   c.population = p ? Number(p.population) : null;
//   return c;
// })
const alphabet = [...Array(26)].map((_, i) => String.fromCharCode(i + 97)); 

const filters = reactive({
  startsWith: false,
  equalStringLength: false,
  equalStartLetter: false,
  equalEndLetter: false
})
const filterValues = reactive({
  startsWith: ''
})

// Kolommen
const columns = [
  { name: 'name', label: 'Land' },
  { name: 'capital', label: 'Hoofdstad' },
  { name: 'population', label: 'Inwoners', type: 'numeric' },
  { name: 'code', label: 'Landcode' },
  { name: 'languages', label: 'Talen', sortable: false },
  { name: 'currencies', label: 'Valuta', sortable: false },
];

// Sorteren
const sortColumn = ref(columns[0]?.name);
const sortOrder = ref('asc');
const sortRows = (column: string, order: string='asc') => {
    sortOrder.value = order;
    sortColumn.value = column;
}

const filteredCountries = computed(() => {
  let list = [...countries]
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

const sortedCountries = computed(() => {
  let [c, d] = sortOrder.value == 'asc' ? [1,-1] : [-1,1];    
  return [...filteredCountries.value].sort((a, b) => { 
    if (a[sortColumn.value] === null) return d;
    if (b[sortColumn.value] === null) return c;
    return a[sortColumn.value] > b[sortColumn.value] ? c : d
  });
});

const availableColors = [
  'bg-red-200 text-red-600',
  'bg-orange-200 text-orange-600',
  'bg-green-200 text-green-600',
  'bg-indigo-200 text-indigo-600',
  'bg-yellow-200 text-yellow-600',
  'bg-emerald-200 text-emerald-600',
  'bg-pink-200 text-pink-600'
  ];
const tagColors = {}
function tagColor(currency) {
  if (!tagColors[currency]) {
    tagColors[currency] = availableColors[Math.floor(Math.random() * availableColors.length)]
  }
  return tagColors[currency]
}

</script>