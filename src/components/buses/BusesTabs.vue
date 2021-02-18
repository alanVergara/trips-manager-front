<template>
    <div>
        <b-card no-body>
            <b-tabs pills card>
                <b-tab title="Listado de buses" active>
                    <b-card-text>
                        <BusesList/>
                    </b-card-text>
                </b-tab>
                <b-tab title="Uso de buses">
                    <b-card-text>
                        <BusesFilterList/>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>

<script>
    import BusesList from './BusesList';
    import BusesFilterList from './BusesFilterList';

    export default {
        name: "BusesTabs",
        components: {
            BusesList,
            BusesFilterList
        }
    }
</script>