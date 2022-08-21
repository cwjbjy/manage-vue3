import { onMounted, onBeforeUnmount, nextTick } from "vue";

const useResize = (echartRef) => {
  const autoSize = () => {
    nextTick(() => {
      let echartsInstance = window.echarts.getInstanceByDom(echartRef.value);
      echartsInstance.resize();
    });
  };
  onMounted(() => {
    window.addEventListener("resize", autoSize, false);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", autoSize, false);
  });
};

export default useResize;
