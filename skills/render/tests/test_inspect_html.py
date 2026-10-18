import contextlib
import io
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from inspect_html import audit_html, collect_html_files, main


GOOD_PAGE = """<!doctype html>
<html lang="en">
<head>
  <title>Example page</title>
  <meta name="description" content="A useful example page.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <a href="/home">Home</a>
  <button type="button">Save</button>
  <img src="/photo.jpg" alt="A person reading">
</body>
</html>
"""


class InspectHtmlTests(unittest.TestCase):
    def test_complete_page_has_no_findings(self):
        self.assertEqual(audit_html(GOOD_PAGE, "page.html"), [])

    def test_missing_document_metadata_is_warning(self):
        findings = audit_html('<html lang="en"><head><title>Page</title></head><body></body></html>', "page.html")
        self.assertEqual({finding.code for finding in findings}, {"W001", "W002"})
        self.assertTrue(all(finding.severity == "warning" for finding in findings))

    def test_missing_language_and_title_are_errors(self):
        findings = audit_html("<html><head></head><body></body></html>", "page.html")
        by_code = {finding.code: finding.severity for finding in findings}
        self.assertEqual(by_code["E001"], "error")
        self.assertEqual(by_code["E002"], "error")

    def test_image_requires_alt_attribute_but_empty_alt_is_allowed(self):
        findings = audit_html('<html lang="en"><head><title>x</title></head><body><img src="a"><img src="b" alt=""></body></html>', "page.html")
        self.assertEqual({finding.code for finding in findings}, {"W001", "W002", "E003"})

    def test_links_and_buttons_need_basic_label_signals(self):
        source = '<html lang="en"><head><title>x</title><meta name="description" content="x"><meta name="viewport" content="width=device-width"></head><body><a href="/"></a><button></button><button aria-label="Close"></button></body></html>'
        findings = audit_html(source, "page.html")
        self.assertEqual([finding.code for finding in findings], ["E004", "E005"])

    def test_nested_image_alt_names_icon_link(self):
        source = '<html lang="en"><head><title>x</title><meta name="description" content="x"><meta name="viewport" content="width=device-width"></head><body><a href="/"><img src="logo.svg" alt="Home"></a></body></html>'
        self.assertEqual(audit_html(source, "page.html"), [])

    def test_form_control_needs_associated_or_programmatic_label(self):
        source = '<html lang="en"><head><title>x</title><meta name="description" content="x"><meta name="viewport" content="width=device-width"></head><body><input id="email"><label for="email">Email</label><textarea></textarea></body></html>'
        findings = audit_html(source, "page.html")
        self.assertEqual([finding.code for finding in findings], ["E006"])

    def test_wrapping_label_names_form_control(self):
        source = '<html lang="en"><head><title>x</title><meta name="description" content="x"><meta name="viewport" content="width=device-width"></head><body><label>Email <input type="email"></label></body></html>'
        self.assertEqual(audit_html(source, "page.html"), [])

    def test_directory_scan_skips_dependency_directories(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            page = root / "index.html"
            ignored = root / "node_modules" / "pkg" / "index.html"
            ignored.parent.mkdir(parents=True)
            page.write_text(GOOD_PAGE)
            ignored.write_text("<html>")
            self.assertEqual(collect_html_files([root]), [page])

    def test_strict_mode_fails_on_warnings(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            page = Path(temp_dir) / "page.html"
            page.write_text('<html lang="en"><head><title>x</title></head><body></body></html>')
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(main(["--strict", str(page)]), 1)

    def test_errors_fail_default_mode(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            page = Path(temp_dir) / "page.html"
            page.write_text("<html><head></head><body><button></button></body></html>")
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(main([str(page)]), 1)

    def test_empty_directory_returns_usage_error(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(main([temp_dir]), 2)


if __name__ == "__main__":
    unittest.main()
