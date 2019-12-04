import React from 'react';
import {Button, View} from 'react-native';

export class HomeScreen extends React.Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Button
                    title="Go to Map"
                    onPress={() => navigate('Map')}
                />
            </View>
        );
    }
}