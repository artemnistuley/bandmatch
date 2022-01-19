<template>
    <div class="heading">
        {{ text }}
    </div>
</template>

<script>
export default {
    props: {
        text: String
    },
}
</script>

<style lang="scss" scoped>
.heading {
    font-size: 5.6rem;
    color: rgba(0, 0, 0, 0.54);
    line-height: 1.3;
    letter-spacing: -.1rem;
    margin-left: -.25rem;
    margin-bottom: 3rem;
}

@media only screen and (max-width: 600px) {
    .heading {
        font-size: 4.5rem;
    }
}
</style>
