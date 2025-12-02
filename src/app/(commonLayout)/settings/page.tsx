import SourcesSettings from "../../../components/settings/SourcesSettings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Other settings will go here.
            </p>
          </CardContent>
        </Card>

        {/* Sources Settings */}
        <SourcesSettings />
      </div>
    </div>
  );
}
