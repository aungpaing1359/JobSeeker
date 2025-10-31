from rest_framework import serializers

class DemoSerializer(serializers.Serializer):
    name=serializers.CharField(write_only=True)

    def validate_name(self, value):
        if len(value.split()) > 5:
            print("Name has multiple parts")
        return value