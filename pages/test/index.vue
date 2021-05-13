<template>
  <div>
    <BaseTest />
    <v-btn @click="onTest">Query</v-btn>
    <v-btn @click="onNewData">New Data</v-btn>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import faker from 'faker';
function getFakeSnapshot() {
  const nof = faker.datatype.number({ max: 10, min: 3 });
  return {
    ages: new Array(nof)
      .fill(0)
      .map(() => faker.helpers.randomize([0, 3, 10, 20, 30, 40, 50, 60, 70])),
    genders: new Array(nof)
      .fill(0)
      .map(() => faker.helpers.randomize([10, 11])),
    number_of_face: nof,
  };
}
function getFakeData() {
  return {
    zoneId: faker.helpers.randomize([
      '609a730836443d14a2362202',
      '609a758036443d14a236220a',
    ]),
    videoId: faker.helpers.randomize([
      '609a755836443d14a2362208',
      '609b66ec3fbba93e9e0cce7f',
    ]),
    adOfferId: faker.helpers.randomize([
      '609b67033fbba93e9e0cce81',
      '609b6212a24d2734798b6508',
      '609b5d76a24d2734798b6507',
    ]),
    timeStamp:
      faker.date
        .between(dayjs().subtract(30, 'd').toDate(), dayjs().hour(23).toDate())
        .valueOf() / 1000,
    snapshots: new Array(faker.datatype.number({ min: 1, max: 10 }))
      .fill(0)
      .map(() => getFakeSnapshot()),
  };
}
export default Vue.extend({
  methods: {
    async onTest() {
      const result = (
        await this.$axios.$get(this.$apiUrl.analyticsAdOffer, {
          params: {
            value: 'runTime',
            frequency: 1,
            timeStart: dayjs().subtract(30, 'd').unix(),
            timeEnd: dayjs().unix(),
          },
        })
      ).data;
      console.log(result);
    },
    onNewData() {
      this.$socket.emit(
        'test',
        new Array(1000).fill(0).map(() => {
          const fake = getFakeData();

          return fake;
        })
      );
    },
  },
});
</script>
