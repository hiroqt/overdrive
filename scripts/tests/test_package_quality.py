import importlib.util
from pathlib import Path
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / 'check_skill_packages.py'
SPEC = importlib.util.spec_from_file_location('check_skill_packages', SCRIPT)
CHECKER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECKER)


class PackageQualityTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        skill = self.root / 'skills/demo'
        (skill / 'references').mkdir(parents=True)
        (skill / 'SKILL.md').write_text(
            '---\nname: demo\ndescription: >-\n  A demo skill.\n---\n\n'
            '[Evaluation](references/evaluation.md)\n'
        )
        (skill / 'references/evaluation.md').write_text(
            '- **[D] Deterministic** — fixture\n'
            '- **[J] LLM as a judge** — fixture\n'
            '- **[H] Human** — fixture\n'
        )
        (self.root / 'README.md').write_text(
            '# Toolkit\n\n## Contents\n\n| Skill | Link |\n| --- | --- |\n'
            '| Demo | [Demo](skills/demo/SKILL.md) |\n\n## Next\n'
        )

    def tearDown(self):
        self.temp.cleanup()

    def errors(self):
        return CHECKER.validate_repository(self.root)

    def test_valid_package_passes(self):
        self.assertEqual([], self.errors())

    def test_frontmatter_name_must_match_folder(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace('name: demo', 'name: other'))
        self.assertTrue(any('does not match folder' in error for error in self.errors()))

    def test_invalid_skill_folder_name_fails(self):
        package = self.root / 'skills/demo'
        renamed = self.root / 'skills/Bad_Name'
        package.rename(renamed)
        skill = renamed / 'SKILL.md'
        skill.write_text(skill.read_text().replace('name: demo', 'name: Bad_Name'))
        readme = self.root / 'README.md'
        readme.write_text(readme.read_text().replace('skills/demo/SKILL.md', 'skills/Bad_Name/SKILL.md'))
        self.assertTrue(any('invalid skill folder name' in error for error in self.errors()))

    def test_missing_frontmatter_closing_delimiter_fails(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace('\n---\n\n', '\n\n'))
        self.assertTrue(any('missing closing YAML frontmatter delimiter' in error
                            for error in self.errors()))

    def test_missing_description_fails(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace('description: >-\n  A demo skill.\n', ''))
        self.assertTrue(any("missing required frontmatter field 'description'" in error
                            for error in self.errors()))

    def test_frontmatter_description_limit_is_enforced(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text('---\nname: demo\ndescription: ' + ('x' * 1025) + '\n---\n')
        self.assertTrue(any('description exceeds 1,024 characters' in error
                            for error in self.errors()))

    def test_compatibility_limit_is_enforced(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace(
            'description: >-', 'compatibility: ' + ('x' * 501) + '\ndescription: >-'
        ))
        self.assertTrue(any('compatibility exceeds 500 characters' in error
                            for error in self.errors()))

    def test_missing_required_evaluation_label_fails(self):
        path = self.root / 'skills/demo/references/evaluation.md'
        path.write_text('## [D] Deterministic\n')
        self.assertTrue(any('missing evaluation summary entry [J]' in error
                            for error in self.errors()))
        self.assertTrue(any('missing evaluation summary entry [H]' in error
                            for error in self.errors()))

    def test_evaluation_labels_in_prose_do_not_count_as_summary_entries(self):
        path = self.root / 'skills/demo/references/evaluation.md'
        path.write_text('The labels [D], [J], and [H] are used below.\n')
        errors = self.errors()
        self.assertTrue(any('missing evaluation summary entry [D]' in error for error in errors))
        self.assertTrue(any('missing evaluation summary entry [J]' in error for error in errors))
        self.assertTrue(any('missing evaluation summary entry [H]' in error for error in errors))

    def test_skill_directory_without_entrypoint_fails(self):
        (self.root / 'skills/incomplete').mkdir()
        self.assertTrue(any('skills/incomplete/SKILL.md: missing skill entrypoint' in error
                            for error in self.errors()))

    def test_broken_local_link_fails(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace('references/evaluation.md', 'references/missing.md'))
        self.assertTrue(any('broken local link' in error for error in self.errors()))

    def test_local_link_cannot_escape_repository(self):
        path = self.root / 'skills/demo/SKILL.md'
        path.write_text(path.read_text().replace(
            'references/evaluation.md', '../../../outside.md'
        ))
        self.assertTrue(any('local link escapes repository' in error for error in self.errors()))

    def test_readme_contents_must_cover_every_skill(self):
        (self.root / 'README.md').write_text('# Toolkit\n\n## Contents\n\nNo skills listed.\n')
        self.assertTrue(any('missing from README Contents' in error for error in self.errors()))


if __name__ == '__main__':
    unittest.main()
