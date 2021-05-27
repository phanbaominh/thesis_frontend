<template>
  <HomeOverview :link="$apiUrl.analyticsOverview">
    <template #link="{ item: ad }">
      <AdLink :ad="ad" />
    </template>
  </HomeOverview>
</template>
