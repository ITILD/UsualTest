<template>
  <a-card
    style="width: 100%"
    title="Card title"
    :tab-list="tabList"
    :active-tab-key="key"
    @tabChange="key => onTabChange(key, 'key')"
  >
    <template #customRender="item">
      <span>
        <!-- <home-outlined /> -->
        {{ item.key }}
      </span>
    </template>
    <template #extra>
      <a href="#">More</a>
    </template>
    {{ contentList[key] }}
  </a-card>
  <br />

</template>
<script>
import { HomeOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    HomeOutlined,
  },

  setup() {
    const tabList = [
      {
        key: 'tab1',
        tab: 'tab1',
      },
      {
        key: 'tab2',
        tab: 'tab2',
      },
    ];
    const contentList = {
      tab1: 'content1',
      tab2: 'content2',
    };

    const key = ref('tab1');
    const noTitleKey = ref('app');

    const onTabChange = (value, type) => {
      console.log(value, type);
      if (type === 'key') {
        key.value = value;
      } else if (type === 'noTitleKey') {
        noTitleKey.value = value;
      }
    };

    return {
      tabList,
      contentList,
      key,
      onTabChange,
    };
  },
});
</script>