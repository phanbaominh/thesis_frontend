<template>
  <div>
    <div>
      <BaseTest />
      <v-btn @click="onTest">Query</v-btn>
      <v-btn @click="onNewData">New Data</v-btn>
      <!-- <input v-model="text" type="text" />
      <v-btn @click="onNewNoti">New noti</v-btn>
      <v-btn @click="onNewDevice">New device</v-btn> -->
    </div>
    <BaseMap />
    <!-- <BuildingPlaceMap /> -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import dayjs from 'dayjs';
import faker from 'faker';
import testData from '~/test';
// zoneId: faker.helpers.randomize([
//       '609a730836443d14a2362202',
//       '609a758036443d14a236220a',
//     ]),
//     videoId: faker.helpers.randomize([
//       '609a755836443d14a2362208',
//       '609b66ec3fbba93e9e0cce7f',
//     ]),
//     adOfferId: faker.helpers.randomize([
//       '609b67033fbba93e9e0cce81',
//       '609b6212a24d2734798b6508',
//       '609b5d76a24d2734798b6507',
//     ]),
function getFakeSnapshot(ageList: number[], genderList: number[]) {
  const nof = faker.datatype.number({ max: 10, min: 3 });
  return {
    ages: new Array(nof).fill(0).map(() => faker.helpers.randomize(ageList)),
    genders: new Array(nof)
      .fill(0)
      .map(() => faker.helpers.randomize(genderList)),
    number_of_face: nof,
  };
}
function getFakeData() {
  const ageList = [0, 3, 3, 70, 70] as number[];
  [10, 20, 30, 40, 50, 60].forEach((age) => {
    const no = faker.datatype.number({ max: 5, min: 2 });
    for (let i = 0; i < no; i++) {
      ageList.push(age);
    }
  });
  const genderList = [] as number[];
  [10, 11].forEach((age) => {
    const no = faker.datatype.number({ max: 3, min: 1 });
    for (let i = 0; i < no; i++) {
      genderList.push(age);
    }
  });
  return {
    zoneId: faker.helpers.randomize(testData.zoneIds),
    videoId: faker.helpers.randomize(testData.videoIds),
    adOfferId: faker.helpers.randomize(testData.adOfferIds),
    deviceId: faker.helpers.randomize(testData.deviceIds),
    imagePath: faker.image.people(640, 480),
    moneyCharge: faker.datatype.number({ min: 1000, max: 10000 }),
    timeStamp:
      faker.date
        .between(dayjs().subtract(365, 'd').toDate(), dayjs().hour(23).toDate())
        .valueOf() / 1000,
    snapshots: new Array(faker.datatype.number({ min: 1, max: 20 }))
      .fill(0)
      .map(() => {
        return getFakeSnapshot(ageList, genderList);
      }),
  };
}
export default Vue.extend({
  data() {
    return {
      text: 'Testing Noti',
    };
  },
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
        new Array(800).fill(0).map(() => {
          const fake = getFakeData();

          return fake;
        })
      );
    },
    async onNewNoti() {
      await this.$axios.$post(this.$apiUrl.userNotification, {
        text: this.text,
      });
    },
    async onNewDevice() {
      await this.$axios.$post(`${this.$apiUrl.devices}/insert-new`, {
        name: faker.name.firstName(),
        serialNumber: faker.datatype.string(),
      });
    },
  },
});
</script>
